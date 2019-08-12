/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  IconNameType,
} from './components/amplify-icon/icons';

export namespace Components {
  interface AmplifyAuthenticator {
    'content': Function;
    'override': boolean;
    'signIn': Function;
  }
  interface AmplifyButton {
    'role': string;
    'styleOverride': boolean;
    'type': string;
  }
  interface AmplifyExamples {}
  interface AmplifyFormField {
    'fieldId': string;
    'hint': string | null;
    'inputProps': {
      type?: string;
      onInput?: (Event) => void;
    };
    'label': string | null;
    'styleOverride': boolean;
  }
  interface AmplifyHint {
    'styleOverride': boolean;
  }
  interface AmplifyIcon {
    /**
    * (Required) Icon name used to determine the icon rendered
    */
    'name': IconNameType;
    'overrideStyle': boolean;
  }
  interface AmplifyLabel {
    'htmlFor': string;
    'styleOverride': boolean;
  }
  interface AmplifyLink {
    'role': string;
    'styleOverride': boolean;
  }
  interface AmplifySceneLoading {
    'loadPercentage': number;
    'sceneError': object;
    'sceneName': string;
  }
  interface AmplifySection {
    'role': string;
    'styleOverride': boolean;
  }
  interface AmplifySectionHeader {
    'styleOverride': boolean;
  }
  interface AmplifySignIn {
    'handleSubmit': (Event) => void;
    'styleOverride': boolean;
    'validationErrors': string;
  }
  interface AmplifySignInPasswordField {
    'component': Function;
    'description': string | null;
    'fieldId': string;
    'hint': string | null;
    'inputProps': {
      type?: string;
      onChange?: (Event) => void;
    };
    'label': string | null;
  }
  interface AmplifySignInUsernameField {
    'component': Function;
    'description': string | null;
    'fieldId': string;
    'hint': string | null;
    'inputProps': {
      type?: string;
      onChange?: (Event) => void;
    };
    'label': string | null;
  }
  interface AmplifyTextField {
    'description': string | null;
    'fieldId': string;
    'inputProps': {
      type?: string;
      onInput?: (Event) => void;
    };
    'label': string | null;
  }
  interface AmplifyTextInput {
    'description': string | null;
    'fieldId': string;
    'inputProps': {
      type?: string;
      onInput?: (Event) => void;
    };
    'label': string | null;
  }
  interface RockPaperScissor {
    'icon': Function;
  }
}

declare global {


  interface HTMLAmplifyAuthenticatorElement extends Components.AmplifyAuthenticator, HTMLStencilElement {}
  var HTMLAmplifyAuthenticatorElement: {
    prototype: HTMLAmplifyAuthenticatorElement;
    new (): HTMLAmplifyAuthenticatorElement;
  };

  interface HTMLAmplifyButtonElement extends Components.AmplifyButton, HTMLStencilElement {}
  var HTMLAmplifyButtonElement: {
    prototype: HTMLAmplifyButtonElement;
    new (): HTMLAmplifyButtonElement;
  };

  interface HTMLAmplifyExamplesElement extends Components.AmplifyExamples, HTMLStencilElement {}
  var HTMLAmplifyExamplesElement: {
    prototype: HTMLAmplifyExamplesElement;
    new (): HTMLAmplifyExamplesElement;
  };

  interface HTMLAmplifyFormFieldElement extends Components.AmplifyFormField, HTMLStencilElement {}
  var HTMLAmplifyFormFieldElement: {
    prototype: HTMLAmplifyFormFieldElement;
    new (): HTMLAmplifyFormFieldElement;
  };

  interface HTMLAmplifyHintElement extends Components.AmplifyHint, HTMLStencilElement {}
  var HTMLAmplifyHintElement: {
    prototype: HTMLAmplifyHintElement;
    new (): HTMLAmplifyHintElement;
  };

  interface HTMLAmplifyIconElement extends Components.AmplifyIcon, HTMLStencilElement {}
  var HTMLAmplifyIconElement: {
    prototype: HTMLAmplifyIconElement;
    new (): HTMLAmplifyIconElement;
  };

  interface HTMLAmplifyLabelElement extends Components.AmplifyLabel, HTMLStencilElement {}
  var HTMLAmplifyLabelElement: {
    prototype: HTMLAmplifyLabelElement;
    new (): HTMLAmplifyLabelElement;
  };

  interface HTMLAmplifyLinkElement extends Components.AmplifyLink, HTMLStencilElement {}
  var HTMLAmplifyLinkElement: {
    prototype: HTMLAmplifyLinkElement;
    new (): HTMLAmplifyLinkElement;
  };

  interface HTMLAmplifySceneLoadingElement extends Components.AmplifySceneLoading, HTMLStencilElement {}
  var HTMLAmplifySceneLoadingElement: {
    prototype: HTMLAmplifySceneLoadingElement;
    new (): HTMLAmplifySceneLoadingElement;
  };

  interface HTMLAmplifySectionElement extends Components.AmplifySection, HTMLStencilElement {}
  var HTMLAmplifySectionElement: {
    prototype: HTMLAmplifySectionElement;
    new (): HTMLAmplifySectionElement;
  };

  interface HTMLAmplifySectionHeaderElement extends Components.AmplifySectionHeader, HTMLStencilElement {}
  var HTMLAmplifySectionHeaderElement: {
    prototype: HTMLAmplifySectionHeaderElement;
    new (): HTMLAmplifySectionHeaderElement;
  };

  interface HTMLAmplifySignInElement extends Components.AmplifySignIn, HTMLStencilElement {}
  var HTMLAmplifySignInElement: {
    prototype: HTMLAmplifySignInElement;
    new (): HTMLAmplifySignInElement;
  };

  interface HTMLAmplifySignInPasswordFieldElement extends Components.AmplifySignInPasswordField, HTMLStencilElement {}
  var HTMLAmplifySignInPasswordFieldElement: {
    prototype: HTMLAmplifySignInPasswordFieldElement;
    new (): HTMLAmplifySignInPasswordFieldElement;
  };

  interface HTMLAmplifySignInUsernameFieldElement extends Components.AmplifySignInUsernameField, HTMLStencilElement {}
  var HTMLAmplifySignInUsernameFieldElement: {
    prototype: HTMLAmplifySignInUsernameFieldElement;
    new (): HTMLAmplifySignInUsernameFieldElement;
  };

  interface HTMLAmplifyTextFieldElement extends Components.AmplifyTextField, HTMLStencilElement {}
  var HTMLAmplifyTextFieldElement: {
    prototype: HTMLAmplifyTextFieldElement;
    new (): HTMLAmplifyTextFieldElement;
  };

  interface HTMLAmplifyTextInputElement extends Components.AmplifyTextInput, HTMLStencilElement {}
  var HTMLAmplifyTextInputElement: {
    prototype: HTMLAmplifyTextInputElement;
    new (): HTMLAmplifyTextInputElement;
  };

  interface HTMLRockPaperScissorElement extends Components.RockPaperScissor, HTMLStencilElement {}
  var HTMLRockPaperScissorElement: {
    prototype: HTMLRockPaperScissorElement;
    new (): HTMLRockPaperScissorElement;
  };
  interface HTMLElementTagNameMap {
    'amplify-authenticator': HTMLAmplifyAuthenticatorElement;
    'amplify-button': HTMLAmplifyButtonElement;
    'amplify-examples': HTMLAmplifyExamplesElement;
    'amplify-form-field': HTMLAmplifyFormFieldElement;
    'amplify-hint': HTMLAmplifyHintElement;
    'amplify-icon': HTMLAmplifyIconElement;
    'amplify-label': HTMLAmplifyLabelElement;
    'amplify-link': HTMLAmplifyLinkElement;
    'amplify-scene-loading': HTMLAmplifySceneLoadingElement;
    'amplify-section': HTMLAmplifySectionElement;
    'amplify-section-header': HTMLAmplifySectionHeaderElement;
    'amplify-sign-in': HTMLAmplifySignInElement;
    'amplify-sign-in-password-field': HTMLAmplifySignInPasswordFieldElement;
    'amplify-sign-in-username-field': HTMLAmplifySignInUsernameFieldElement;
    'amplify-text-field': HTMLAmplifyTextFieldElement;
    'amplify-text-input': HTMLAmplifyTextInputElement;
    'rock-paper-scissor': HTMLRockPaperScissorElement;
  }
}

declare namespace LocalJSX {
  interface AmplifyAuthenticator extends JSXBase.HTMLAttributes<HTMLAmplifyAuthenticatorElement> {
    'content'?: Function;
    'onAuthStateChange'?: (event: CustomEvent<any>) => void;
    'override'?: boolean;
    'signIn'?: Function;
  }
  interface AmplifyButton extends JSXBase.HTMLAttributes<HTMLAmplifyButtonElement> {
    'role'?: string;
    'styleOverride'?: boolean;
    'type'?: string;
  }
  interface AmplifyExamples extends JSXBase.HTMLAttributes<HTMLAmplifyExamplesElement> {}
  interface AmplifyFormField extends JSXBase.HTMLAttributes<HTMLAmplifyFormFieldElement> {
    'fieldId'?: string;
    'hint'?: string | null;
    'inputProps'?: {
      type?: string;
      onInput?: (Event) => void;
    };
    'label'?: string | null;
    'styleOverride'?: boolean;
  }
  interface AmplifyHint extends JSXBase.HTMLAttributes<HTMLAmplifyHintElement> {
    'styleOverride'?: boolean;
  }
  interface AmplifyIcon extends JSXBase.HTMLAttributes<HTMLAmplifyIconElement> {
    /**
    * (Required) Icon name used to determine the icon rendered
    */
    'name'?: IconNameType;
    'overrideStyle'?: boolean;
  }
  interface AmplifyLabel extends JSXBase.HTMLAttributes<HTMLAmplifyLabelElement> {
    'htmlFor'?: string;
    'styleOverride'?: boolean;
  }
  interface AmplifyLink extends JSXBase.HTMLAttributes<HTMLAmplifyLinkElement> {
    'role'?: string;
    'styleOverride'?: boolean;
  }
  interface AmplifySceneLoading extends JSXBase.HTMLAttributes<HTMLAmplifySceneLoadingElement> {
    'loadPercentage'?: number;
    'sceneError'?: object;
    'sceneName'?: string;
  }
  interface AmplifySection extends JSXBase.HTMLAttributes<HTMLAmplifySectionElement> {
    'role'?: string;
    'styleOverride'?: boolean;
  }
  interface AmplifySectionHeader extends JSXBase.HTMLAttributes<HTMLAmplifySectionHeaderElement> {
    'styleOverride'?: boolean;
  }
  interface AmplifySignIn extends JSXBase.HTMLAttributes<HTMLAmplifySignInElement> {
    'handleSubmit'?: (Event) => void;
    'styleOverride'?: boolean;
    'validationErrors'?: string;
  }
  interface AmplifySignInPasswordField extends JSXBase.HTMLAttributes<HTMLAmplifySignInPasswordFieldElement> {
    'component'?: Function;
    'description'?: string | null;
    'fieldId'?: string;
    'hint'?: string | null;
    'inputProps'?: {
      type?: string;
      onChange?: (Event) => void;
    };
    'label'?: string | null;
  }
  interface AmplifySignInUsernameField extends JSXBase.HTMLAttributes<HTMLAmplifySignInUsernameFieldElement> {
    'component'?: Function;
    'description'?: string | null;
    'fieldId'?: string;
    'hint'?: string | null;
    'inputProps'?: {
      type?: string;
      onChange?: (Event) => void;
    };
    'label'?: string | null;
  }
  interface AmplifyTextField extends JSXBase.HTMLAttributes<HTMLAmplifyTextFieldElement> {
    'description'?: string | null;
    'fieldId'?: string;
    'inputProps'?: {
      type?: string;
      onInput?: (Event) => void;
    };
    'label'?: string | null;
  }
  interface AmplifyTextInput extends JSXBase.HTMLAttributes<HTMLAmplifyTextInputElement> {
    'description'?: string | null;
    'fieldId'?: string;
    'inputProps'?: {
      type?: string;
      onInput?: (Event) => void;
    };
    'label'?: string | null;
  }
  interface RockPaperScissor extends JSXBase.HTMLAttributes<HTMLRockPaperScissorElement> {
    'icon'?: Function;
    'onIconChange'?: (event: CustomEvent<any>) => void;
  }

  interface IntrinsicElements {
    'amplify-authenticator': AmplifyAuthenticator;
    'amplify-button': AmplifyButton;
    'amplify-examples': AmplifyExamples;
    'amplify-form-field': AmplifyFormField;
    'amplify-hint': AmplifyHint;
    'amplify-icon': AmplifyIcon;
    'amplify-label': AmplifyLabel;
    'amplify-link': AmplifyLink;
    'amplify-scene-loading': AmplifySceneLoading;
    'amplify-section': AmplifySection;
    'amplify-section-header': AmplifySectionHeader;
    'amplify-sign-in': AmplifySignIn;
    'amplify-sign-in-password-field': AmplifySignInPasswordField;
    'amplify-sign-in-username-field': AmplifySignInUsernameField;
    'amplify-text-field': AmplifyTextField;
    'amplify-text-input': AmplifyTextInput;
    'rock-paper-scissor': RockPaperScissor;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


