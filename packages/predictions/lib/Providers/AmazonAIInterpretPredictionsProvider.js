'use strict';
var __extends =
	(this && this.__extends) ||
	(function() {
		var extendStatics = function(d, b) {
			extendStatics =
				Object.setPrototypeOf ||
				({ __proto__: [] } instanceof Array &&
					function(d, b) {
						d.__proto__ = b;
					}) ||
				function(d, b) {
					for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
				};
			return extendStatics(d, b);
		};
		return function(d, b) {
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype =
				b === null
					? Object.create(b)
					: ((__.prototype = b.prototype), new __());
		};
	})();
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function(resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function(thisArg, body) {
		var _ = {
				label: 0,
				sent: function() {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function() {
					return this;
				}),
			g
		);
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
Object.defineProperty(exports, '__esModule', { value: true });
var core_1 = require('@aws-amplify/core');
var Providers_1 = require('../types/Providers');
var types_1 = require('../types');
var aws_sdk_1 = require('aws-sdk');
var AmazonAIInterpretPredictionsProvider = /** @class */ (function(_super) {
	__extends(AmazonAIInterpretPredictionsProvider, _super);
	function AmazonAIInterpretPredictionsProvider() {
		return _super.call(this) || this;
	}
	AmazonAIInterpretPredictionsProvider.prototype.getProviderName = function() {
		return 'AmazonAIInterpretPredictionsProvider';
	};
	AmazonAIInterpretPredictionsProvider.prototype.interpretText = function(
		input
	) {
		var _this = this;
		return new Promise(function(res, rej) {
			return __awaiter(_this, void 0, void 0, function() {
				var credentials,
					_a,
					_b,
					_c,
					region,
					_d,
					_e,
					interpretTypeConfig,
					_f,
					_g,
					_h,
					_j,
					text,
					_k,
					interpretType,
					_l,
					_m,
					_o,
					language,
					comprehend,
					doAll,
					languagePromise,
					languageDetectionParams,
					entitiesPromise,
					LanguageCode,
					_p,
					entitiesDetectionParams,
					sentimentPromise,
					LanguageCode,
					_q,
					sentimentParams,
					syntaxPromise,
					LanguageCode,
					_r,
					syntaxParams,
					keyPhrasesPromise,
					LanguageCode,
					_s,
					keyPhrasesParams,
					results,
					err_1;
				return __generator(this, function(_t) {
					switch (_t.label) {
						case 0:
							return [4 /*yield*/, core_1.Credentials.get()];
						case 1:
							credentials = _t.sent();
							if (!credentials) return [2 /*return*/, rej('No credentials')];
							(_a = this._config.interpretText),
								(_b = _a === void 0 ? {} : _a),
								(_c = _b.region),
								(region = _c === void 0 ? '' : _c),
								(_d = _b.defaults),
								(_e = (_d === void 0 ? {} : _d).type),
								(interpretTypeConfig = _e === void 0 ? '' : _e);
							(_f = input.text),
								(_g = _f === void 0 ? {} : _f),
								(_h = _g.source),
								(_j = (_h === void 0 ? {} : _h).text),
								(text = _j === void 0 ? '' : _j),
								(_k = _g.type),
								(interpretType = _k === void 0 ? interpretTypeConfig : _k);
							(_l = input.text),
								(_m = (_l === void 0 ? {} : _l).source),
								(_o = (_m === void 0 ? {} : _m).language),
								(language = _o === void 0 ? undefined : _o);
							comprehend = new aws_sdk_1.Comprehend({
								credentials: credentials,
								region: region,
							});
							doAll = interpretType === types_1.InterpretTextCategories.ALL;
							if (
								doAll ||
								interpretType === types_1.InterpretTextCategories.LANGUAGE
							) {
								languageDetectionParams = {
									Text: text,
								};
								languagePromise = this.detectLanguage(
									languageDetectionParams,
									comprehend
								);
							}
							if (
								!(
									doAll ||
									interpretType === types_1.InterpretTextCategories.ENTITIES
								)
							)
								return [3 /*break*/, 4];
							_p = language;
							if (_p) return [3 /*break*/, 3];
							return [4 /*yield*/, languagePromise];
						case 2:
							_p = _t.sent();
							_t.label = 3;
						case 3:
							LanguageCode = _p;
							if (!LanguageCode) {
								return [
									2 /*return*/,
									rej('language code is required on source for this selection'),
								];
							}
							entitiesDetectionParams = {
								Text: text,
								LanguageCode: LanguageCode,
							};
							entitiesPromise = this.detectEntities(
								entitiesDetectionParams,
								comprehend
							);
							_t.label = 4;
						case 4:
							if (
								!(
									doAll ||
									interpretType === types_1.InterpretTextCategories.SENTIMENT
								)
							)
								return [3 /*break*/, 7];
							_q = language;
							if (_q) return [3 /*break*/, 6];
							return [4 /*yield*/, languagePromise];
						case 5:
							_q = _t.sent();
							_t.label = 6;
						case 6:
							LanguageCode = _q;
							if (!LanguageCode) {
								return [
									2 /*return*/,
									rej('language code is required on source for this selection'),
								];
							}
							sentimentParams = {
								Text: text,
								LanguageCode: LanguageCode,
							};
							sentimentPromise = this.detectSentiment(
								sentimentParams,
								comprehend
							);
							_t.label = 7;
						case 7:
							if (
								!(
									doAll ||
									interpretType === types_1.InterpretTextCategories.SYNTAX
								)
							)
								return [3 /*break*/, 10];
							_r = language;
							if (_r) return [3 /*break*/, 9];
							return [4 /*yield*/, languagePromise];
						case 8:
							_r = _t.sent();
							_t.label = 9;
						case 9:
							LanguageCode = _r;
							if (!LanguageCode) {
								return [
									2 /*return*/,
									rej('language code is required on source for this selection'),
								];
							}
							syntaxParams = {
								Text: text,
								LanguageCode: LanguageCode,
							};
							syntaxPromise = this.detectSyntax(syntaxParams, comprehend);
							_t.label = 10;
						case 10:
							if (
								!(
									doAll ||
									interpretType === types_1.InterpretTextCategories.KEY_PHRASES
								)
							)
								return [3 /*break*/, 13];
							_s = language;
							if (_s) return [3 /*break*/, 12];
							return [4 /*yield*/, languagePromise];
						case 11:
							_s = _t.sent();
							_t.label = 12;
						case 12:
							LanguageCode = _s;
							if (!LanguageCode) {
								return [
									2 /*return*/,
									rej('language code is required on source for this selection'),
								];
							}
							keyPhrasesParams = {
								Text: text,
								LanguageCode: LanguageCode,
							};
							keyPhrasesPromise = this.detectKeyPhrases(
								keyPhrasesParams,
								comprehend
							);
							_t.label = 13;
						case 13:
							_t.trys.push([13, 15, , 16]);
							return [
								4 /*yield*/,
								Promise.all([
									languagePromise,
									entitiesPromise,
									sentimentPromise,
									syntaxPromise,
									keyPhrasesPromise,
								]),
							];
						case 14:
							results = _t.sent();
							res({
								textInterpretation: {
									keyPhrases: results[4] || [],
									language: results[0] || '',
									sentiment: results[2],
									syntax: results[3] || [],
									textEntities: results[1] || [],
								},
							});
							return [3 /*break*/, 16];
						case 15:
							err_1 = _t.sent();
							rej(err_1);
							return [3 /*break*/, 16];
						case 16:
							return [2 /*return*/];
					}
				});
			});
		});
	};
	AmazonAIInterpretPredictionsProvider.prototype.detectKeyPhrases = function(
		params,
		comprehend
	) {
		return new Promise(function(res, rej) {
			comprehend.detectKeyPhrases(params, function(err, data) {
				var _a = (data || {}).KeyPhrases,
					KeyPhrases = _a === void 0 ? [] : _a;
				if (err) {
					if (err.code === 'AccessDeniedException') {
						rej(
							'Not authorized, did you enable Interpret Text on predictions category Amplify CLI? try: ' +
								'amplify predictions add'
						);
					} else {
						rej(err.message);
					}
				} else {
					res(
						KeyPhrases.map(function(_a) {
							var text = _a.Text;
							return { text: text };
						})
					);
				}
			});
		});
	};
	AmazonAIInterpretPredictionsProvider.prototype.detectSyntax = function(
		params,
		comprehend
	) {
		var _this = this;
		return new Promise(function(res, rej) {
			comprehend.detectSyntax(params, function(err, data) {
				var _a = (data || {}).SyntaxTokens,
					SyntaxTokens = _a === void 0 ? [] : _a;
				if (err) {
					if (err.code === 'AccessDeniedException') {
						rej(
							'Not authorized, did you enable Interpret Text on predictions category Amplify CLI? try: ' +
								'amplify predictions add'
						);
					} else {
						rej(err.message);
					}
				} else {
					res(_this.serializeSyntaxFromComprehend(SyntaxTokens));
				}
			});
		});
	};
	AmazonAIInterpretPredictionsProvider.prototype.serializeSyntaxFromComprehend = function(
		tokens
	) {
		var response = [];
		if (tokens && Array.isArray(tokens)) {
			response = tokens.map(function(_a) {
				var _b = _a.Text,
					text = _b === void 0 ? '' : _b,
					_c = _a.PartOfSpeech,
					_d = (_c === void 0 ? {} : _c).Tag,
					syntax = _d === void 0 ? '' : _d;
				return { text: text, syntax: syntax };
			});
		}
		return response;
	};
	AmazonAIInterpretPredictionsProvider.prototype.detectSentiment = function(
		params,
		comprehend
	) {
		return new Promise(function(res, rej) {
			comprehend.detectSentiment(params, function(err, data) {
				if (err) {
					if (err.code === 'AccessDeniedException') {
						rej(
							'Not authorized, did you enable Interpret Text on predictions category Amplify CLI? try: ' +
								'amplify predictions add'
						);
					} else {
						rej(err.message);
					}
				} else {
					var _a = data,
						_b = _a.Sentiment,
						predominant = _b === void 0 ? '' : _b,
						_c = _a.SentimentScore,
						_d = _c === void 0 ? {} : _c,
						_e = _d.Positive,
						positive = _e === void 0 ? 0 : _e,
						_f = _d.Negative,
						negative = _f === void 0 ? 0 : _f,
						_g = _d.Neutral,
						neutral = _g === void 0 ? 0 : _g,
						_h = _d.Mixed,
						mixed = _h === void 0 ? 0 : _h;
					res({
						predominant: predominant,
						positive: positive,
						negative: negative,
						neutral: neutral,
						mixed: mixed,
					});
				}
			});
		});
	};
	AmazonAIInterpretPredictionsProvider.prototype.detectEntities = function(
		params,
		comprehend
	) {
		var _this = this;
		return new Promise(function(res, rej) {
			comprehend.detectEntities(params, function(err, data) {
				var _a = (data || {}).Entities,
					Entities = _a === void 0 ? [] : _a;
				if (err) {
					if (err.code === 'AccessDeniedException') {
						rej(
							'Not authorized, did you enable Interpret Text on predictions category Amplify CLI? try: ' +
								'amplify predictions add'
						);
					} else {
						rej(err.message);
					}
				} else {
					res(_this.serializeEntitiesFromComprehend(Entities));
				}
			});
		});
	};
	AmazonAIInterpretPredictionsProvider.prototype.serializeEntitiesFromComprehend = function(
		data
	) {
		var response = [];
		if (data && Array.isArray(data)) {
			response = data.map(function(_a) {
				var type = _a.Type,
					text = _a.Text;
				return { type: type, text: text };
			});
		}
		return response;
	};
	AmazonAIInterpretPredictionsProvider.prototype.detectLanguage = function(
		params,
		comprehend
	) {
		return new Promise(function(res, rej) {
			comprehend.detectDominantLanguage(params, function(err, data) {
				if (err) {
					if (err.code === 'AccessDeniedException') {
						rej(
							'Not authorized, did you enable Interpret Text on predictions category Amplify CLI? try: ' +
								'amplify predictions add'
						);
					} else {
						rej(err.message);
					}
				} else {
					var _a = (data || {}).Languages,
						LanguageCode = (_a === void 0 ? [''] : _a)[0].LanguageCode;
					if (!LanguageCode) {
						rej('Language not detected');
					}
					res(data.Languages[0].LanguageCode);
				}
			});
		});
	};
	return AmazonAIInterpretPredictionsProvider;
})(Providers_1.AbstractInterpretPredictionsProvider);
exports.default = AmazonAIInterpretPredictionsProvider;
//# sourceMappingURL=AmazonAIInterpretPredictionsProvider.js.map
