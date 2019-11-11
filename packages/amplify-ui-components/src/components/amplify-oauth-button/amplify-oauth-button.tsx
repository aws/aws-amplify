import { Auth } from '@aws-amplify/auth';
import { Component, h, Listen, Prop } from '@stencil/core';

import { SIGN_IN_WITH_AWS } from '../../common/constants';
import { FederatedConfig } from '../../common/types/auth-types';

@Component({
  tag: 'amplify-oauth-button',
  shadow: false,
})
export class AmplifyOAuthButton {
  @Prop() config: FederatedConfig['oauthConfig'] = {};

  @Listen('click')
  handleClick(event) {
    event.preventDefault();
    Auth.federatedSignIn();
  }

  render() {
    return <amplify-sign-in-button provider="oauth">{this.config.label || SIGN_IN_WITH_AWS}</amplify-sign-in-button>;
  }
}
