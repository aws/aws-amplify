import { ConsoleLogger as Logger } from '@aws-amplify/core';
import {
	S3Client,
	CopyObjectCommandInput,
	CopyObjectCommand,
	CreateMultipartUploadCommand,
	CompleteMultipartUploadCommandInput,
	CompletedPart,
	CompleteMultipartUploadCommand,
	AbortMultipartUploadCommandInput,
	AbortMultipartUploadCommand,
	ListPartsCommand,
	UploadPartCopyCommand,
	ListObjectsV2Command,
	CopyObjectCommandOutput,
	_Object,
	CompleteMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';
import { AWSS3ProviderMultipartCopierErrors } from '../common/StorageErrorStrings';
import * as events from 'events';

const logger = new Logger('AWSS3ProviderMultipartCopier');
const DEFAULT_QUEUE_SIZE = 20;
const MAX_NUM_PARTS = 10000;

type ListObjectContent = _Object;

export const COPY_PROGRESS = 'sendCopyProgress';

export interface CopyPart {
	partNumber: number;
	startByte: number;
	endByte: number;
}

export interface AWSS3ProviderMultipartCopierParams {
	params: CopyObjectCommandInput;
	emitter: events.EventEmitter;
	s3client: S3Client;
	queueSize?: number;
}

export class AWSS3ProviderMultipartCopier {
	static readonly minPartSize = 5 * 1024 * 1024; // 5MB, minimum requirement for a multipart copy
	static readonly partSize = 50 * 1024 * 1024;
	private readonly destBucket: string;
	private readonly destKey: string;
	private readonly emitter: events.EventEmitter;
	private readonly queueSize: number;
	private readonly s3client: S3Client;
	private readonly srcBucket: string;
	private readonly srcKey: string;
	private bytesCopied = 0;
	private completedParts: CompletedPart[] = [];
	private params: CopyObjectCommandInput;
	private totalBytesToCopy = 0;
	private totalParts = 0;

	constructor({ params, emitter, s3client, queueSize = DEFAULT_QUEUE_SIZE }: AWSS3ProviderMultipartCopierParams) {
		this.params = params;
		this.emitter = emitter;
		this.s3client = s3client;
		this.queueSize = queueSize;
		const { CopySource, Key, Bucket } = this.params;
		this._validateInput();
		this.srcKey = CopySource.substr(CopySource.indexOf('/') + 1);
		this.srcBucket = CopySource.substr(0, CopySource.indexOf('/'));
		this.destKey = Key;
		this.destBucket = Bucket;
	}

	private _validateInput() {
		if (this.queueSize <= 0) {
			throw new Error(AWSS3ProviderMultipartCopierErrors.INVALID_QUEUESIZE);
		}
		if (!Object.prototype.hasOwnProperty.call(this.params, 'CopySource')) {
			throw new Error(AWSS3ProviderMultipartCopierErrors.NO_COPYSOURCE);
		}
	}

	/**
	 * Copies a file from srcKey to destKey.  It will first make a ListObjectV2Command to make sure the file exist and get
	 * the object size.  This function always prioritize using multipart copy, it will only do a basic CopyObjectCommand
	 * if the file size if less than 5MB.
	 *
	 * @async
	 * @throws Will throw an error if any of the requests fails, or if it's cancelled.
	 * @return Key of the copied object.
	 */
	public async copy(): Promise<CompleteMultipartUploadCommandOutput | CopyObjectCommandOutput> {
		let uploadId: string = undefined;
		try {
			const { Size } = await this._getObjectMetadata();
			this.totalBytesToCopy = Size;
			// Fallback to basic CopyObject if the file is smaller than the minimum required 5MB.
			if (this.totalBytesToCopy <= AWSS3ProviderMultipartCopier.minPartSize) {
				const copyObjectCommand = new CopyObjectCommand(this.params);
				const result = await this.s3client.send(copyObjectCommand);
				// Since the S3 Javascript SDK doesn't expose the progress event, we can only send an event once the copy is
				// complete
				this.emitter.emit(COPY_PROGRESS, {
					loaded: this.totalBytesToCopy,
					total: this.totalBytesToCopy,
				});
				return result;
			} else {
				this.totalParts = Math.ceil(this.totalBytesToCopy / AWSS3ProviderMultipartCopier.partSize);
				if (this.totalParts > MAX_NUM_PARTS) {
					// Maximum of 10000 parts' allowed as per S3's spec
					throw new Error(AWSS3ProviderMultipartCopierErrors.MAX_NUM_PARTS_EXCEEDED);
				}
				uploadId = await this._initMultipartUpload();
				for (let i = 0; i < this.totalParts; i += this.queueSize) {
					await Promise.all(this._makeParts(i).map(part => this._uploadPart(part, uploadId)));
				}
				return await this._completeMultipartCopy(uploadId);
			}
		} catch (err) {
			if (uploadId !== undefined) {
				await this._cleanup(uploadId);
			}
			throw err;
		}
	}

	private async _completeMultipartCopy(uploadId: string) {
		const input: CompleteMultipartUploadCommandInput = {
			Bucket: this.params.Bucket,
			Key: this.params.Key,
			UploadId: uploadId,
			MultipartUpload: {
				// Part Number might not be in the exact correct order so we should sort it beforehand
				Parts: this.completedParts.sort((a, b) => a.PartNumber - b.PartNumber),
			},
		};
		logger.debug('Completing the multipart upload', this.completedParts);
		const completeUploadCommand = new CompleteMultipartUploadCommand(input);
		try {
			const result = await this.s3client.send(completeUploadCommand);
			return result;
		} catch (err) {
			logger.error('error happend while finishing the copy. Aborting the multipart copy', err);
			throw err;
		}
	}

	private async _uploadPart(part: CopyPart, uploadId: string) {
		const uploadPartCopyOutput = await this.s3client.send(
			new UploadPartCopyCommand({
				Bucket: this.destBucket,
				Key: this.destKey,
				CopySource: this.params.CopySource,
				CopySourceRange: `bytes=${part.startByte}-${part.endByte}`,
				PartNumber: part.partNumber,
				UploadId: uploadId,
			})
		);
		this.bytesCopied += part.endByte - part.startByte + 1;
		this.emitter.emit(COPY_PROGRESS, {
			loaded: this.bytesCopied,
			total: this.totalBytesToCopy,
		});
		this.completedParts.push({
			PartNumber: part.partNumber,
			ETag: uploadPartCopyOutput.CopyPartResult.ETag,
		});
		return uploadPartCopyOutput;
	}

	private _makeParts(startPartIndex: number): CopyPart[] {
		const parts: CopyPart[] = [];
		const partsRemaining = this.totalParts - startPartIndex;
		for (let i = 0; i < Math.min(this.queueSize, partsRemaining); i++) {
			const startByte = (startPartIndex + i) * AWSS3ProviderMultipartCopier.partSize;
			const endByte = Math.min(startByte + AWSS3ProviderMultipartCopier.partSize, this.totalBytesToCopy) - 1;
			parts.push({
				partNumber: startPartIndex + i + 1,
				startByte,
				endByte,
			});
		}
		return parts;
	}

	private async _cleanup(uploadId: string): Promise<void> {
		this.bytesCopied = 0;
		this.completedParts = [];
		this.totalBytesToCopy = 0;

		const input: AbortMultipartUploadCommandInput = {
			Bucket: this.params.Bucket,
			Key: this.params.Key,
			UploadId: uploadId,
		};

		await this.s3client.send(new AbortMultipartUploadCommand(input));

		const result = await this.s3client.send(new ListPartsCommand(input));

		if (result && result.Parts && result.Parts.length > 0) {
			throw new Error(AWSS3ProviderMultipartCopierErrors.CLEANUP_FAILED);
		}
	}

	private async _initMultipartUpload(): Promise<string> {
		const { CopySource, ...multipartUploadInput } = this.params;
		const response = await this.s3client.send(new CreateMultipartUploadCommand(multipartUploadInput));
		logger.debug(`Created multipart upload request with id ${response.UploadId}`);
		return response.UploadId;
	}

	private async _getObjectMetadata(): Promise<ListObjectContent> {
		const listObjectCommand = new ListObjectsV2Command({
			Bucket: this.srcBucket,
			Prefix: this.srcKey,
		});
		const { Contents = [] } = await this.s3client.send(listObjectCommand);
		const sourceObject = Contents.find(obj => obj.Key === this.srcKey);
		if (!sourceObject) {
			throw new Error(`${AWSS3ProviderMultipartCopierErrors.NO_OBJECT_FOUND} with key: "${this.srcKey}"`);
		}
		return sourceObject;
	}
}