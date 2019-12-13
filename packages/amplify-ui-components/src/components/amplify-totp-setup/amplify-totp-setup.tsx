import { Component, Prop, State, h } from '@stencil/core';
import QRCode from 'qrcode';

import { Logger, isEmpty } from '@aws-amplify/core';
import { CognitoUserInterface, AuthStateHandler, AuthState } from '../../common/types/auth-types';
import { Auth } from '@aws-amplify/auth';
import { totpSetup } from './amplify-totp-setup.style';
import { MfaMethod, TOTPSetupEventType } from './amplify-totp-setup-interface';
import {
  NO_AUTH_MODULE_FOUND,
  TOTP_SETUP_FAILURE,
  NO_TOTP_CODE_PROVIDED,
  TOTP_SUCCESS_MESSAGE,
  TOTP_HEADER_TEXT,
  TOTP_SUBMIT_BUTTON_TEXT,
  SETUP_TOTP,
  SUCCESS,
  ALT_QR_CODE,
  TOTP_LABEL,
} from '../../common/constants';

const logger = new Logger('TOTP');

@Component({
  tag: 'amplify-totp-setup',
  shadow: false,
})
export class AmplifyTOTPSetup {
  /** Used in order to configure TOTP for a user */
  @Prop() user: CognitoUserInterface = null;
  /** Used to set autoFocus to true when TOTP Component has loaded */
  @Prop() inputProps: object = {
    autoFocus: true,
  };
  /** Passed from the Authenticator component in order to change Authentication state */
  @Prop() handleAuthStateChange: AuthStateHandler;

  @State() code: string | null = null;
  @State() setupMessage: string | null = null;
  @State() qrCodeImageSource: string;
  @State() qrCodeInput: string | null = null;

  componentDidLoad() {
    this.setup();
  }

  checkContact(user) {
    if (!Auth || typeof Auth.verifiedContact !== 'function') {
      throw new Error(NO_AUTH_MODULE_FOUND);
    }
    Auth.verifiedContact(user).then(data => {
      if (!isEmpty(data.verified)) {
        this.handleAuthStateChange(AuthState.SignedIn, user);
      } else {
        const newUser = Object.assign(user, data);
        this.handleAuthStateChange(AuthState.VerifyContact, newUser);
      }
    });
  }

  onTOTPEvent(event: TOTPSetupEventType, data: any, user: CognitoUserInterface) {
    logger.debug('on totp event', event, data);

    if (event === SETUP_TOTP && data === SUCCESS) {
      this.checkContact(user);
    }
  }

  triggerTOTPEvent(event: TOTPSetupEventType, data: any, user: CognitoUserInterface) {
    if (this.onTOTPEvent) {
      this.onTOTPEvent(event, data, user);
    }
  }

  handleTotpInputChange(event) {
    this.setupMessage = null;
    this.qrCodeInput = event.target.value;
  }

  async generateQRCode(codeFromTotp: string) {
    try {
      this.qrCodeImageSource = await QRCode.toDataURL(codeFromTotp);
    } catch (error) {
      throw new Error(error);
    }
  }

  setup() {
    this.setupMessage = null;
    const user = this.user;
    const issuer = encodeURI('AWSCognito');

    if (!Auth || typeof Auth.setupTOTP !== 'function') {
      throw new Error(NO_AUTH_MODULE_FOUND);
    }

    Auth.setupTOTP(user)
      .then(secretKey => {
        logger.debug('secret key', secretKey);
        const code = `otpauth://totp/${issuer}:${user.username}?secret=${secretKey}&issuer=${issuer}`;
        this.code = code;

        this.generateQRCode(this.code);
      })
      .catch(error => {
        logger.debug(TOTP_SETUP_FAILURE, error);
      });
  }

  verifyTotpToken() {
    if (event) {
      event.preventDefault();
    }

    if (!this.qrCodeInput) {
      logger.debug(NO_TOTP_CODE_PROVIDED);
      return;
    }

    const user = this.user;

    if (!Auth || typeof Auth.verifyTotpToken !== 'function' || typeof Auth.setPreferredMFA !== 'function') {
      throw new Error(NO_AUTH_MODULE_FOUND);
    }

    Auth.verifyTotpToken(user, this.qrCodeInput)
      .then(() => {
        Auth.setPreferredMFA(user, MfaMethod.TOTP);
        this.setupMessage = TOTP_SUCCESS_MESSAGE;
        logger.debug(TOTP_SUCCESS_MESSAGE);
        this.triggerTOTPEvent(SETUP_TOTP, SUCCESS, user);
      })
      .catch(error => {
        this.setupMessage = TOTP_SETUP_FAILURE;
        logger.error(error);
      });
  }

  // TODO add Toast component to the Top of the form section
  render() {
    return (
      <amplify-form-section
        headerText={TOTP_HEADER_TEXT}
        submitButtonText={TOTP_SUBMIT_BUTTON_TEXT}
        handleSubmit={() => this.verifyTotpToken()}
      >
        <div class={totpSetup}>
          <img src={this.qrCodeImageSource} alt={ALT_QR_CODE} />
          <amplify-form-field
            label={TOTP_LABEL}
            inputProps={this.inputProps}
            fieldId="totpCode"
            name="totpCode"
            handleInputChange={event => this.handleTotpInputChange(event)}
          />
        </div>
      </amplify-form-section>
    );
  }
}
