import {
	S3Client,
	CopyObjectCommand,
	CopyObjectRequest,
	S3ClientConfig,
	CompleteMultipartUploadCommand,
	UploadPartCopyCommand,
	CreateMultipartUploadCommand,
	ListPartsCommand,
	AbortMultipartUploadCommand,
	ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { AWSS3ProviderMultipartCopier } from '../../src/providers/AWSS3ProviderMultipartCopy';
import * as events from 'events';

const testInput: CopyObjectRequest = {
	Bucket: 'testBucket',
	CopySource: 'srcBucket/srcKey',
	Key: 'destKey',
};

const testS3ClientConfig: S3ClientConfig = {
	region: 'testRegion',
};

afterEach(() => {
	jest.restoreAllMocks();
	jest.clearAllMocks();
});

describe('constructor test', () => {
	test('happy case - all valid params', async () => {
		new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
	});

	test('error - queue size <= 0', () => {
		expect(() => new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
			queueSize: -1,
		})).toThrowError('Queue size must be a positive number');
	})

	test('error - no copy source', () => {
		expect(() => new AWSS3ProviderMultipartCopier({
			params: {
				Bucket: 'testBucket',
				Key: 'destKey',
			} as CopyObjectRequest,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		})).toThrowError('You must specify a copy source');
	})
});

describe('basic copy test', () => {
	test('happy case - copy small file', async () => {
		const spyon = jest
			.spyOn(S3Client.prototype, 'send')
			.mockImplementation(command => {
				if (command instanceof CopyObjectCommand) {
					return Promise.resolve(command.input.Key);
				} else if (command instanceof ListObjectsV2Command) {
					return {
						Contents: [
							{
								Size: 100,
								Key: 'srcKey',
							},
						],
					};
				}
			});
		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
		const result = await copier.copy();
		expect(result).toEqual('destKey');
		expect(spyon).toBeCalledTimes(2);
	});

	test('Should throw error if no content is found', async () => {
		const spyon = jest
			.spyOn(S3Client.prototype, 'send')
			.mockImplementation(async command => {
				if (command instanceof CopyObjectCommand) {
					return command.input.Key;
				} else if (command instanceof ListObjectsV2Command) {
					return {
						KeyCount: 0,
					}
				}
			});
		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
		await expect(copier.copy()).rejects.toThrow(
			'Object does not exist with key: "srcKey"'
		);
		expect(spyon).toBeCalledTimes(1);
	});

	test('Should throw error if maximum number of parts is exceeded', async () => {
		const spyon = jest
			.spyOn(S3Client.prototype, 'send')
			.mockImplementation(async command => {
				if (command instanceof CopyObjectCommand) {
					return command.input.Key;
				} else if (command instanceof ListObjectsV2Command) {
					return {
						KeyCount: 0,
						Contents: [{
							Key: 'srcKey',
							Size: 999999999999,
						}]
					}
				}
			});
		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
		await expect(copier.copy()).rejects.toThrowError('Only a maximum of 10000 parts are allowed');
		expect(spyon).toBeCalledTimes(1);
	})
});

describe('multipart copy tests', () => {
	const testContentLength = AWSS3ProviderMultipartCopier.partSize * 3;
	test('happy case - multipart copy', async () => {
		const spyon = jest
			.spyOn(S3Client.prototype, 'send')
			.mockImplementation(async command => {
				if (command instanceof ListObjectsV2Command) {
					return {
						Contents: [
							{
								Size: testContentLength,
								Key: 'srcKey',
								ETag: 'etag',
							},
						],
					};
				} else if (command instanceof CreateMultipartUploadCommand) {
					return {
						UploadId: '123',
					};
				} else if (command instanceof UploadPartCopyCommand) {
					return {
						CopyPartResult: {
							ETag: `ETag_${command.input.PartNumber}`,
						},
					};
				} else if (command instanceof CompleteMultipartUploadCommand) {
					return {
						Key: 'destKey',
					};
				}
			});

		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
		const result = await copier.copy();
		expect(spyon).toBeCalledTimes(6);
		// list object call to check file size
		expect(spyon.mock.calls[0][0].input).toStrictEqual({
			Bucket: 'srcBucket',
			Prefix: 'srcKey',
		});
		// Initialize a multipartUpload
		expect(spyon.mock.calls[1][0].input).toStrictEqual({
			Bucket: 'testBucket',
			Key: 'destKey',
		});
		// First UploadPartCopy call
		expect(spyon.mock.calls[2][0].input).toStrictEqual({
			Bucket: 'testBucket',
			CopySource: 'srcBucket/srcKey',
			Key: 'destKey',
			PartNumber: 1,
			UploadId: '123',
			CopySourceRange: `bytes=0-${AWSS3ProviderMultipartCopier.partSize - 1}`,
		});
		// Second UploadPartCopy call
		expect(spyon.mock.calls[3][0].input).toStrictEqual({
			Bucket: 'testBucket',
			CopySource: 'srcBucket/srcKey',
			Key: 'destKey',
			PartNumber: 2,
			UploadId: '123',
			CopySourceRange: `bytes=${
				AWSS3ProviderMultipartCopier.partSize
			}-${AWSS3ProviderMultipartCopier.partSize * 2 - 1}`,
		});
		// Third UploadPartCopy call
		expect(spyon.mock.calls[4][0].input).toStrictEqual({
			Bucket: 'testBucket',
			CopySource: 'srcBucket/srcKey',
			Key: 'destKey',
			PartNumber: 3,
			UploadId: '123',
			CopySourceRange: `bytes=${AWSS3ProviderMultipartCopier.partSize *
				2}-${AWSS3ProviderMultipartCopier.partSize * 3 - 1}`,
		});
		// Finally, CompleteMultipartUpload call
		expect(spyon.mock.calls[5][0].input).toStrictEqual({
			Bucket: 'testBucket',
			Key: 'destKey',
			UploadId: '123',
			MultipartUpload: {
				Parts: [
					{
						ETag: 'ETag_1',
						PartNumber: 1,
					},
					{
						ETag: 'ETag_2',
						PartNumber: 2,
					},
					{
						ETag: 'ETag_3',
						PartNumber: 3,
					},
				],
			},
		});
		expect(result).toStrictEqual({
			Key: 'destKey',
		});
	});

	test('Should throw error if upload failed in-flight', async () => {
		jest.spyOn(S3Client.prototype, 'send').mockImplementation(async command => {
			if (command instanceof ListObjectsV2Command) {
				return {
					Contents: [
						{
							Size: testContentLength,
							Key: 'srcKey',
						},
					],
				};
			} else if (command instanceof CreateMultipartUploadCommand) {
				return {
					UploadId: '123',
				};
			} else if (command instanceof UploadPartCopyCommand) {
				// Simulate failing after the first request
				if (command.input.PartNumber > 1) {
					throw new Error('err');
				}
				return {
					CopyPartResult: {
						ETag: `ETag_${command.input.PartNumber}`,
					},
				};
			} else if (command instanceof CompleteMultipartUploadCommand) {
				return {
					Key: 'destKey',
				};
			} else if (command instanceof AbortMultipartUploadCommand) {
				return {
					Parts: [],
				};
			}
		});
		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
			queueSize: 1,
		});
		await expect(copier.copy()).rejects.toThrow('err');
	});

	test('Should throw error if cleanup failed', async () => {
		S3Client.prototype.send = jest.fn(async command => {
			if (command instanceof ListObjectsV2Command) {
				return {
					Contents: [
						{
							Size: testContentLength,
							Key: 'srcKey',
						},
					],
				};
			} else if (command instanceof CreateMultipartUploadCommand) {
				return {
					UploadId: '123',
				};
			} else if (command instanceof UploadPartCopyCommand) {
				return Promise.reject('err');
			} else if (command instanceof ListPartsCommand) {
				return {
					Parts: [
						{
							ETag: 'ETag_1',
							PartNumber: 1,
						},
					],
				};
			}
		});
		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
		await expect(copier.copy()).rejects.toThrow(
			'Multipart copy clean up failed'
		);
	});

	test('Should throw error if multipartUpload cannot be finalized', async () => {
		jest.spyOn(S3Client.prototype, 'send').mockImplementation(async command => {
			if (command instanceof ListObjectsV2Command) {
				return {
					Contents: [
						{
							Size: testContentLength,
							Key: 'srcKey',
						},
					],
				};
			} else if (command instanceof CreateMultipartUploadCommand) {
				return {
					UploadId: '123',
				};
			} else if (command instanceof UploadPartCopyCommand) {
				return {
					CopyPartResult: {
						ETag: `ETag_${command.input.PartNumber}`,
					},
				};
			} else if (command instanceof CompleteMultipartUploadCommand) {
				throw new Error('err');
			}
		});

		const copier = new AWSS3ProviderMultipartCopier({
			params: testInput,
			emitter: new events.EventEmitter(),
			s3client: new S3Client(testS3ClientConfig),
		});
		await expect(copier.copy()).rejects.toThrow('err');
	});
});