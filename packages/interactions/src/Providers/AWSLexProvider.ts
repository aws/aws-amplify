/*
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { AbstractInteractionsProvider } from './InteractionsProvider';
import { InteractionsOptions, InteractionsResponse } from '../types';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';
import { ConsoleLogger as Logger, AWS, Credentials } from '@aws-amplify/core';
import { registerHelper } from 'handlebars';

const logger = new Logger('AWSLexProvider');

export class AWSLexProvider extends AbstractInteractionsProvider {

    private aws_lex: LexRuntime;
    private _botsCompleteCallback: object;


    constructor(options: InteractionsOptions = {}) {
        super(options);
        this.aws_lex = new LexRuntime({ region: this._config.region });
        this._botsCompleteCallback = {};
    }

    getProviderName() { return 'AWSLexProvider'; }

    sendMessage(botname: string, message: string | Object): Promise<object> {
        return new Promise(async (res, rej) => {
            if (!this._config[botname]) {
                return rej('Bot ' + botname + ' does not exist');
            }
            const credentials = await Credentials.get();
            if (!credentials) { return rej('No credentials'); }
            AWS.config.update({
                credentials
            });

            this.aws_lex = new LexRuntime({ region: this._config[botname].region, credentials });
            //  TODO: Implement for content
            let params = {
                botAlias: this._config[botname].alias,
                botName: this._config[botname].name,
                userId: credentials.identityId
            };
            if (typeof message === 'string') {
                params = Object.assign({ inputText: message }, params);
            } else {
                params = Object.assign({}, message, params);
            }
            // logger.debug('postText params', params);

            this.aws_lex.postText(<LexRuntime.PostTextRequest> params, (err, data) => {
                if (err) {
                    rej(err);
                    return;
                } else {
                    // Check if state is fulfilled to resolve onFullfilment promise
                    logger.debug('postText state', data.dialogState);
                    if (data.dialogState === 'ReadyForFulfillment' || data.dialogState === 'Fulfilled') {
                        if (typeof this._botsCompleteCallback[botname] === 'function') {
                            setTimeout(() => this._botsCompleteCallback[botname](null, { slots: data.slots }), 0);
                        }
                        
                        if (this._config && typeof this._config[botname].onComplete === 'function') {
                            setTimeout(() => this._config[botname].onComplete(null, { slots: data.slots }), 0);
                        }
                    }

                    res(data);
                    if (data.dialogState === 'Failed') {
                        if (typeof this._botsCompleteCallback[botname] === 'function') {
                            setTimeout(
                                () => this._botsCompleteCallback[botname]('Bot conversation failed'), 0);
                        }
                        if (this._config && typeof this._config[botname].onComplete === 'function') {
                            setTimeout(() => this._config[botname].onComplete('Bot conversation failed'), 0);
                        }
                    }
                }
            });
        });
    }

    onComplete(botname: string, callback) {
        if (!this._config[botname]) {
            throw new ErrorEvent('Bot ' + botname + ' does not exist');
        }
        this._botsCompleteCallback[botname] = callback;
    }
}
