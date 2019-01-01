/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import * as React from 'react';
import { I18n, ConsoleLogger as Logger } from '@aws-amplify/core';


import AuthPiece, { IAuthPieceProps, IAuthPieceState } from './AuthPiece';
import AmplifyTheme from '../AmplifyTheme';
import {
    FormSection,
    SectionBody
} from '../Amplify-UI/Amplify-UI-Components-React';

const logger = new Logger('Loading');

export default class Loading extends AuthPiece<IAuthPieceProps, IAuthPieceState> {
    constructor(props) {
        super(props);

        this._validAuthStates = ['loading'];
    }

    showComponent(theme) {
        const { hide } = this.props;
        if (hide && hide.includes(Loading)) { return null; }

        return (
            <FormSection theme={theme}>
                <SectionBody theme={theme}>{I18n.get('Loading...')}
                </SectionBody>
            </FormSection>
        );
    }
}
