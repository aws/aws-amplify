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

import React from 'react';
import { 
    View,
    Text,
    TextInput
} from 'react-native';
import {
    Auth,
    I18n,
    Logger
} from 'aws-amplify';
import AmplifyTheme from '../AmplifyTheme';
import { 
    ConfirmationCode,
    Button,
    LinkCell,
    Padding,
    Header,
    ErrorRow
} from '../AmplifyUI';
import AuthPiece from './AuthPiece';

const logger = new Logger('SignIn');

const Footer = (props) => {
    const theme = props.theme || AmplifyTheme;
    return (
        <View style={theme.sectionFooter}>
            <LinkCell theme={theme} onPress={() => onStateChange('signIn')}>
                {I18n.get('Back to Sign In')}
            </LinkCell>
        </View>
    )
}

export default class ConfirmSignIn extends AuthPiece {
    constructor(props) {
        super(props);

        this.state = {
            code: null,
            error: null
        }

        this.confirm = this.confirm.bind(this);
    }

    confirm() {
        const user = this.props.authData;
        const { code } = this.state;
        logger.debug('Confirm Sign In for ' + user.username);
        Auth.confirmSignIn(user, code)
            .then(data => this.changeState('signedIn'))
            .catch(err => this.error(err));
    }

    render() {
        if (!['confirmSignIn'].includes(this.props.authState)) {
            return null;
        }

        const theme = this.props.theme || AmplifyTheme;
        return (
            <View style={theme.section}>
                <Padding theme={theme} />
                <Header theme={theme}>{I18n.get('Confirm Sign In')}</Header>
                <View style={theme.sectionBody}>
                    <ConfirmationCode
                        theme={theme}
                        onChangeText={(text) => this.setState({ code: text })}
                    />
                    <View style={theme.sectionActions}>
                        <Button
                            title={I18n.get('Confirm')}
                            onPress={this.confirm}
                            disabled={!this.state.code}
                        />
                    </View>
                </View>
                <Footer theme={theme} onStateChange={this.changeState}/>
                <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
                <Padding theme={theme} />
            </View>
        );
    }
}
