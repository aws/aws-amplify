/// <reference types="node" />
/**
 * Base types
 */
export interface PredictionsOptions {
	[key: string]: any;
}
export interface ProviderOptions {
	providerName?: string;
}
/**
 * Convert types
 */
export declare enum InterpretTextCategories {
	ALL = 'ALL',
	LANGUAGE = 'LANGUAGE',
	ENTITIES = 'ENTITIES',
	SENTIMENT = 'SENTIMENT',
	SYNTAX = 'SYNTAX',
	KEY_PHRASES = 'KEY_PHRASES',
}
export interface InterpretTextInput {
	text: InterpretTextInputLanguage | InterpretTextOthers | InterpretTextAll;
}
export interface InterpretTextInputLanguage {
	source: {
		text: string;
	};
	type: InterpretTextCategories.LANGUAGE;
}
export interface InterpretTextOthers {
	source: {
		text: string;
		language: string;
	};
	type:
		| InterpretTextCategories.ENTITIES
		| InterpretTextCategories.SENTIMENT
		| InterpretTextCategories.SYNTAX
		| InterpretTextCategories.KEY_PHRASES;
}
export interface InterpretTextAll {
	source: {
		text: string;
	};
	type: InterpretTextCategories.ALL;
}
export interface TextEntities {
	type: string;
	text: string;
}
export interface KeyPhrases {
	text: string;
}
export interface TextSyntax {
	text: string;
	syntax: string;
}
export interface TextSentiment {
	predominant: string;
	positive: number;
	negative: number;
	neutral: number;
	mixed: number;
}
export interface InterpretTextOutput {
	textInterpretation: {
		language?: string;
		textEntities?: Array<TextEntities>;
		keyPhrases?: Array<KeyPhrases>;
		sentiment?: TextSentiment;
		syntax?: Array<TextSyntax>;
	};
}
export interface TranslateTextInput {
	translateText: {
		source: {
			text: string;
			language?: string;
		};
		targetLanguage?: string;
	};
}
export interface TranslateTextOutput {
	text: string;
	language: string;
}
export interface TextToSpeechInput {
	textToSpeech: {
		source: {
			text: string;
		};
		terminology?: string;
		voiceId?: string;
	};
}
export interface TextToSpeechOutput {
	speech: {
		url: string;
	};
	audioStream: Buffer;
	text: string;
}
export interface StorageSource {
	key: string;
	level?: 'public' | 'private' | 'protected';
	identityId?: string;
}
export interface FileSource {
	file: File;
}
export interface BytesSource {
	bytes: Buffer | ArrayBuffer | Blob | string;
}
export interface SpeechToTextInput {
	transcription: {
		source: BytesSource;
		language?: string;
	};
}
export interface SpeechToTextOutput {
	transcription: {
		fullText: string;
	};
}
export declare type IdentifySource = StorageSource | FileSource | BytesSource;
export interface IdentifyTextInput {
	text: {
		source: IdentifySource;
		format?: 'PLAIN' | 'FORM' | 'TABLE' | 'ALL';
	};
}
export interface Word {
	text?: string;
	polygon?: Polygon;
	boundingBox?: BoundingBox;
}
export interface LineDetailed {
	text?: string;
	polygon?: Polygon;
	boundingBox?: BoundingBox;
	page?: number;
}
export interface Content {
	text?: string;
	selected?: boolean;
}
export interface TableCell extends Content {
	boundingBox?: BoundingBox;
	polygon?: Polygon;
	rowSpan?: Number;
	columnSpan?: Number;
}
export interface Table {
	size: {
		rows: number;
		columns: number;
	};
	table: TableCell[][];
	polygon: Polygon;
	boundingBox: BoundingBox;
}
export interface KeyValue {
	key: string;
	value: Content;
	polygon: Polygon;
	boundingBox: BoundingBox;
}
export interface IdentifyTextOutput {
	text: {
		fullText: string;
		lines: string[];
		linesDetailed: LineDetailed[];
		words: Word[];
		keyValues?: KeyValue[];
		tables?: Table[];
		selections?: {
			selected: boolean;
			polygon: Polygon;
			boundingBox: BoundingBox;
		}[];
	};
}
export interface IdentifyLabelsInput {
	labels: {
		source: IdentifySource;
		type: 'LABELS' | 'UNSAFE' | 'ALL';
	};
}
export interface Point {
	x?: Number;
	y?: Number;
}
export declare type Polygon = Point[];
export interface BoundingBox {
	width?: Number;
	height?: Number;
	left?: Number;
	top?: Number;
}
export interface IdentifyLabelsOutput {
	labels?: {
		name: string;
		boundingBoxes: BoundingBox[];
		metadata?: Object;
	}[];
	unsafe?: 'YES' | 'NO' | 'UNKNOWN';
}
export interface IdentifyEntitiesInput {
	entities: IdentifyFromCollection | IdentifyCelebrities | IdentifyEntities;
}
export interface IdentifyFromCollection {
	source: IdentifySource;
	collection: true;
	collectionId?: string;
	maxEntities?: number;
}
export interface IdentifyCelebrities {
	source: IdentifySource;
	celebrityDetection: true;
}
export interface IdentifyEntities {
	source: IdentifySource;
}
export interface FaceAttributes {
	smile?: boolean;
	eyeglasses?: boolean;
	sunglasses?: boolean;
	gender?: string;
	beard?: boolean;
	mustache?: boolean;
	eyesOpen?: boolean;
	mouthOpen?: boolean;
	emotions?: string[];
}
export interface IdentifyEntitiesOutput {
	entities: {
		boundingBox?: BoundingBox;
		ageRange?: {
			low?: Number;
			high?: Number;
		};
		landmarks?: {
			type?: string;
			x?: number;
			y?: number;
		}[];
		attributes?: FaceAttributes;
		metadata?: object;
	}[];
}
export declare function isIdentifyFromCollection(
	obj: any
): obj is IdentifyFromCollection;
export declare function isIdentifyCelebrities(
	obj: any
): obj is IdentifyCelebrities;
export declare function isTranslateTextInput(
	obj: any
): obj is TranslateTextInput;
export declare function isTextToSpeechInput(obj: any): obj is TextToSpeechInput;
export declare function isSpeechToTextInput(obj: any): obj is SpeechToTextInput;
export declare function isStorageSource(obj: any): obj is StorageSource;
export declare function isFileSource(obj: any): obj is FileSource;
export declare function isBytesSource(obj: any): obj is BytesSource;
export declare function isIdentifyTextInput(obj: any): obj is IdentifyTextInput;
export declare function isIdentifyLabelsInput(
	obj: any
): obj is IdentifyLabelsInput;
export declare function isIdentifyEntitiesInput(
	obj: any
): obj is IdentifyEntitiesInput;
export declare function isInterpretTextInput(
	obj: any
): obj is InterpretTextInput;
