import { Auth } from '@aws-amplify/auth';
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import { Component, h, Prop } from '@stencil/core';

import { AUTH_SOURCE_KEY, NO_AUTH_MODULE_FOUND, SIGN_IN_WITH_GOOGLE } from '../../common/constants';
import { AuthState, FederatedConfig } from '../../common/types/auth-types';

const logger = new Logger('amplify-google-button');

@Component({
  tag: 'amplify-google-button',
  shadow: false,
})
export class AmplifyGoogleButton {
  /** Passed from the Authenticator component in order to change Authentication state
   * e.g. SignIn -> 'Create Account' link -> SignUp
   */
  @Prop() handleAuthStateChange: (nextAuthState: AuthState, data?: object) => void;
  /** App-specific client ID from Google */
  @Prop() clientId: FederatedConfig['googleClientId'];
  /** (Optional) Override default styling */
  @Prop() overrideStyle: boolean = false;

  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  getAuthInstance() {
    if (window['gapi'] && window['gapi'].auth2) {
      return (
        window['gapi'].auth2.getAuthInstance() ||
        window['gapi'].auth2.init({
          client_id: this.clientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email openid',
        })
      );
    }

    return null;
  }

  handleClick = event => {
    event.preventDefault();

    this.getAuthInstance()
      .signIn()
      .then(this.handleUser)
      .catch(this.handleError);
  };

  handleError = error => {
    console.error(error);
  };

  /**
   * @see https://developers.google.com/identity/sign-in/web/build-button#building_a_button_with_a_custom_graphic
   */
  handleLoad = () => {
    window['gapi'].load('auth2');
  };

  handleUser = async user => {
    if (!Auth || typeof Auth.federatedSignIn !== 'function' || typeof Auth.currentAuthenticatedUser !== 'function') {
      throw new Error(NO_AUTH_MODULE_FOUND);
    }

    try {
      window.localStorage.setItem(AUTH_SOURCE_KEY, JSON.stringify({ provider: 'google' }));
    } catch (e) {
      logger.debug('Failed to cache auth source into localStorage', e);
    }

    const { id_token, expires_at } = user.getAuthResponse();
    const profile = user.getBasicProfile();

    await Auth.federatedSignIn(
      'google',
      { token: id_token, expires_at },
      {
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl(),
      },
    );

    const authenticatedUser = await Auth.currentAuthenticatedUser();

    try {
      this.handleAuthStateChange(AuthState.SignedIn, authenticatedUser);
    } catch (error) {
      this.handleError(error);
    }
  };

  render() {
    return (
      <amplify-sign-in-button onClick={this.handleClick} overrideStyle={this.overrideStyle} provider="google">
        <script onLoad={this.handleLoad} src="https://apis.google.com/js/api:client.js"></script>
        {SIGN_IN_WITH_GOOGLE}
      </amplify-sign-in-button>
    );
  }
}
