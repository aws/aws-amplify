jest.mock('aws-sdk/clients/pinpoint', () => {
    const Pinpoint = () => {
        var pinpoint = null;
        return pinpoint;
    }

    Pinpoint.prototype.updateEndpoint = (params, callback) => {
        callback(null, 'data');
    }

    return Pinpoint;
});

jest.mock('amazon-cognito-identity-js/lib/CognitoUserSession', () => {
    const CognitoUserSession = () => {}

    CognitoUserSession.prototype.CognitoUserSession = (options) => {
        CognitoUserSession.prototype.options = options;
        return CognitoUserSession;
    }

    CognitoUserSession.prototype.getIdToken = () => {
        return {
            getJwtToken: () => {
                return null;
            }
        }
    }

    CognitoUserSession.prototype.isValid = () => {
        return true;
    }

    CognitoUserSession.prototype.getRefreshToken = () => {
        return 'refreshToken';
    }

    return CognitoUserSession;
});

jest.mock('amazon-cognito-identity-js/lib/CognitoIdToken', () => {
    const CognitoIdToken = () => {}

    CognitoIdToken.prototype.CognitoIdToken = (value) => {
        CognitoIdToken.prototype.idToken = value;
        return CognitoIdToken;
    }

    CognitoIdToken.prototype.getJwtToken = () => {
        return 'jwtToken';
    }


    return CognitoIdToken;
});

jest.mock('amazon-cognito-identity-js/lib/CognitoUserPool', () => {
    const CognitoUserPool = () => {};

    CognitoUserPool.prototype.CognitoUserPool = (options) => {
        CognitoUserPool.prototype.options = options;
        return CognitoUserPool;
    }

    CognitoUserPool.prototype.getCurrentUser = () => {
        return "currentUser";
    }

    CognitoUserPool.prototype.signUp = (username, password, signUpAttributeList, validationData, callback) => {
        callback(null, 'signUpResult');
    }

    return CognitoUserPool;
});

jest.mock('amazon-cognito-identity-js/lib/CognitoUser', () => {
    const CognitoUser = () => {}

    CognitoUser.prototype.CognitoUser = (options) => {
        CognitoUser.prototype.options = options;
        return CognitoUser;
    }

    CognitoUser.prototype.getSession = (callback) => {
       // throw 3;
        callback(null, "session");
    }

    CognitoUser.prototype.getUserAttributes = (callback) => {
        callback(null, "attributes");
    }

    CognitoUser.prototype.getAttributeVerificationCode = (attr, callback) => {
        callback.onSuccess("success");
    }

    CognitoUser.prototype.verifyAttribute = (attr, code, callback) => {
        callback.onSuccess("success");
    }

    CognitoUser.prototype.authenticateUser = (authenticationDetails, callback) => {
        callback.onSuccess('session');
    }

    CognitoUser.prototype.sendMFACode = (code, callback) => {
        callback.onSuccess('session');
    }

    CognitoUser.prototype.resendConfirmationCode = (callback) => {
        callback(null, 'result');
    }

    CognitoUser.prototype.changePassword = (oldPassword, newPassword, callback) => {
        callback(null, 'SUCCESS');
    }

    CognitoUser.prototype.forgotPassword = (callback) => {
        callback.onSuccess();
    }

    CognitoUser.prototype.confirmPassword = (code, password, callback) => {
        callback.onSuccess();
    }

    CognitoUser.prototype.signOut = () => {

    }

    CognitoUser.prototype.confirmRegistration = (confirmationCode, forceAliasCreation, callback) => {
        callback(null, 'Success');
    }

    CognitoUser.prototype.completeNewPasswordChallenge = (password, requiredAttributes, callback) => {
        callback.onSuccess('session');
    }

    CognitoUser.prototype.updateAttributes = (attributeList, callback) => {
        callback(null, 'SUCCESS');
    }

    CognitoUser.prototype.refreshSession = (refreshToken, callback) => {
        callback(null, 'session');
    }

    return CognitoUser;
});

jest.mock('amazon-cognito-auth-js/lib/CognitoAuth', () => {
    const CognitoAuth = () => {};

    CognitoAuth.prototype.parseCognitoWebResponse = () => {
        CognitoAuth.prototype.userhandler.onSuccess();
        throw 'err';
    }

    return CognitoAuth;
});

jest.mock('../../src/Common/Builder', () => {
    return {
        default: null
    };
});

import { AuthOptions, SignUpParams } from '../../src/Auth/types';
import Auth from '../../src/Auth/Auth';
import Cache from '../../src/Cache';
import { CookieStorage, CognitoUserPool, CognitoUser, CognitoUserSession, CognitoIdToken, CognitoAccessToken } from 'amazon-cognito-identity-js';
import { CognitoIdentityCredentials, Credentials } from 'aws-sdk';
import GoogleOAuth from '../../src/Common/OAuthHelper/GoogleOAuth';

const authOptions = {
    Auth: {
        userPoolId: "awsUserPoolsId",
        userPoolWebClientId: "awsUserPoolsWebClientId",
        region: "region",
        identityPoolId: "awsCognitoIdentityPoolId"
    }
}

const authOptionsWithNoUserPoolId = {
    Auth: {
        userPoolId: null,
        userPoolWebClientId: "awsUserPoolsWebClientId",
        region: "region",
        identityPoolId: "awsCognitoIdentityPoolId"
    }
}

const userPool = new CognitoUserPool({
    UserPoolId: authOptions.Auth.userPoolId,
    ClientId: authOptions.Auth.userPoolWebClientId
});

const idToken = new CognitoIdToken({IdToken: 'idToken'});
const accessToken = new CognitoAccessToken({AccessToken: 'accessToken'});

const session = new CognitoUserSession({
    IdToken: idToken,
    AccessToken: accessToken
});

const cognitoCredentialSpyon = jest.spyOn(CognitoIdentityCredentials.prototype, 'getPromise').mockImplementation(() => {
    return new Promise((res, rej) => {
        res('cred');
    });
})

describe('auth unit test', () => {
    describe('signUp', () => {
        test('happy case with string attrs', async () => {
            const spyon = jest.spyOn(CognitoUserPool.prototype, "signUp");
            const auth = new Auth(authOptions);

            expect.assertions(1);
            expect(await auth.signUp('username', 'password', 'email','phone')).toBe('signUpResult');

            spyon.mockClear();
        });

        test('happy case with object attr', async () => {
            const spyon = jest.spyOn(CognitoUserPool.prototype, "signUp");
            const auth = new Auth(authOptions);

            const attrs = {
                username: 'username',
                password: 'password',
                attributes: {
                    email: 'email',
                    phone_number: 'phone_number',
                    otherAttrs: 'otherAttrs'
                }
            }
            expect.assertions(1);
            expect(await auth.signUp(attrs)).toBe('signUpResult');

            spyon.mockClear();
        });

        test('object attr with null username', async () => {
            const auth = new Auth(authOptions);

            const attrs = {
                username: null,
                password: 'password',
                attributes: {
                    email: 'email',
                    phone_number: 'phone_number',
                    otherAttrs: 'otherAttrs'
                }
            }
            expect.assertions(1);
            try {
                await auth.signUp(attrs);
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('callback error', async () => {
            const spyon = jest.spyOn(CognitoUserPool.prototype, "signUp")
                .mockImplementationOnce((username, password, signUpAttributeList, validationData, callback) => {
                    callback('err', null);
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.signUp('username', 'password', 'email','phone');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('no user pool', async () => {
            const auth = new Auth(authOptionsWithNoUserPoolId);

            expect.assertions(1);
            try {
                await auth.signUp('username', 'password', 'email','phone');
            } catch (e) {
                expect(e).toBe('No userPool');
            }
        });

        test('no username', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.signUp(null, 'password', 'email','phone');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('no password', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.signUp('username', null, 'email','phone');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('only username', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.signUp('username');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });
    });

    describe('confirmSignUp', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "confirmRegistration");
            const auth = new Auth(authOptions);

            expect.assertions(1);
            expect(await auth.confirmSignUp('username', 'code')).toBe('Success');

            spyon.mockClear();
        });

        test('callback err', async () => {
             const spyon = jest.spyOn(CognitoUser.prototype, "confirmRegistration")
                .mockImplementationOnce((confirmationCode, forceAliasCreation, callback) => {
                    callback('err', null);
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.confirmSignUp('username', 'code');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('no user pool', async () => {
            const auth = new Auth(authOptionsWithNoUserPoolId);

            expect.assertions(1);
            try {
                await auth.confirmSignUp('username', 'code');
            } catch (e) {
                expect(e).toBe('No userPool');
            }
        });

        test('no user name', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.confirmSignUp(null, 'code');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('no code', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.confirmSignUp('username', null);
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });
    });

    describe('resendSignUp', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "resendConfirmationCode");
            const auth = new Auth(authOptions);

            expect.assertions(1);
            expect(await auth.resendSignUp('username')).toBe('result');

            spyon.mockClear();
        });

        test('callback err', async () => {
             const spyon = jest.spyOn(CognitoUser.prototype, "resendConfirmationCode")
                .mockImplementationOnce((callback) => {
                    callback('err', null);
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.resendSignUp('username');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('no user pool', async () => {
            const auth = new Auth(authOptionsWithNoUserPoolId);

            expect.assertions(1);
            try {
                await auth.resendSignUp('username');
            } catch (e) {
                expect(e).toBe('No userPool');
            }
        });

        test('no username', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.resendSignUp(null);
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });
    });

    describe('signIn', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'authenticateUser')
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.onSuccess(session);
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(user);

            spyon.mockClear();
        });

        test('happy case using cookie storage', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'authenticateUser')
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.onSuccess(session);
                });

            const auth = new Auth({ ...authOptions, cookieStorage: { domain: ".example.com" } });
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool,
                Storage: new CookieStorage({domain: ".yourdomain.com"})
            });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(user);

            spyon.mockClear();
        });

        test('onFailure', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "authenticateUser")
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.onFailure('err');
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.signIn('username', 'password');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('mfaRequired', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "authenticateUser")
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.mfaRequired('challengeName', 'challengeParam');
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const userAfterSignedIn = Object.assign(
                {},
                user,
                {
                    "challengeName": "challengeName",
                    "challengeParam": "challengeParam"
                });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(userAfterSignedIn);

            spyon.mockClear();
        });

        test('mfaSetup', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "authenticateUser")
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.mfaSetup('challengeName', 'challengeParam');
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const userAfterSignedIn = Object.assign(
                {},
                user,
                {
                    "challengeName": "challengeName",
                    "challengeParam": "challengeParam"
                });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(userAfterSignedIn);

            spyon.mockClear();
        });

        test('totpRequired', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "authenticateUser")
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.totpRequired('challengeName', 'challengeParam');
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const userAfterSignedIn = Object.assign(
                {},
                user,
                {
                    "challengeName": "challengeName",
                    "challengeParam": "challengeParam"
                });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(userAfterSignedIn);

            spyon.mockClear();
        });

        test('selectMFAType', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "authenticateUser")
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.selectMFAType('challengeName', 'challengeParam');
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const userAfterSignedIn = Object.assign(
                {},
                user,
                {
                    "challengeName": "challengeName",
                    "challengeParam": "challengeParam"
                });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(userAfterSignedIn);

            spyon.mockClear();
        });

        test('newPasswordRequired', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "authenticateUser")
                .mockImplementationOnce((authenticationDetails, callback) => {
                    callback.newPasswordRequired('userAttributes', 'requiredAttributes');
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const userAfterSignedIn = Object.assign(
                {},
                user,
                {
                    "challengeName": "NEW_PASSWORD_REQUIRED",
                    "challengeParam": {
                        "requiredAttributes": "requiredAttributes",
                        "userAttributes": "userAttributes"
                    }
                });

            expect.assertions(1);
            expect(await auth.signIn('username', 'password')).toEqual(userAfterSignedIn);

            spyon.mockClear();
        });

        test('no userPool', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'authenticateUser');

            const auth = new Auth(authOptionsWithNoUserPoolId);

            expect.assertions(1);
            try {
                await auth.signIn('username', 'password');
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
        });

        test('no username', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'authenticateUser');
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.signIn(null, 'password');
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
        });

        test('no password', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'authenticateUser');
            const auth = new Auth(authOptions);
            expect.assertions(1);
            try {
                await auth.signIn('username', null);
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
        });
    });

    describe("confirmSignIn", () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "sendMFACode")
                .mockImplementationOnce((code, callback) => {
                    callback.onSuccess(session);
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.confirmSignIn(user, 'code')).toEqual(user);

            spyon.mockClear();
        });

        test('onFailure', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "sendMFACode")
                .mockImplementationOnce((code, callback) => {
                    callback.onFailure('err');
                });
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            try {
                await auth.confirmSignIn(user, 'code');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('no code', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "sendMFACode");
            const auth = new Auth(authOptions);

            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.confirmSignIn(user, null);
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
        });
    });

    describe('completeNewPassword', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'completeNewPasswordChallenge')
                .mockImplementationOnce((password, requiredAttributes, callback) => {
                    callback.onSuccess(session);
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.completeNewPassword(user, 'password', {})).toEqual(user);

            spyon.mockClear();
        });

        test('on Failure', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'completeNewPasswordChallenge')
                .mockImplementationOnce((password, requiredAttributes, callback) => {
                    callback.onFailure('err');
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.completeNewPassword(user, 'password', {})
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('mfaRequired', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'completeNewPasswordChallenge')
                .mockImplementationOnce((password, requiredAttributes, callback) => {
                    callback.mfaRequired('challengeName', 'challengeParam');
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.completeNewPassword(user, 'password', {})).toBe(user);

            spyon.mockClear();
        });

        test('no password', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.completeNewPassword(user, null, {});
            } catch (e) {
                expect(e).toBe('Password cannot be empty');
            }
        });
    });

    describe('userAttributes', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(Auth.prototype, 'userSession')
                .mockImplementationOnce((user) => {
                    return new Promise((res, rej) => {
                        res('session');
                    });
                });

            const spyon2 = jest.spyOn(CognitoUser.prototype, 'getUserAttributes');

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.userAttributes(user)).toBe('attributes');

            spyon.mockClear();
            spyon2.mockClear();
        });

        test('get userattributes failed', async () => {
            const spyon = jest.spyOn(Auth.prototype, 'userSession')
                .mockImplementationOnce((user) => {
                    return new Promise((res, rej) => {
                        res('session');
                    });
                });

            const spyon2 = jest.spyOn(CognitoUser.prototype, 'getUserAttributes')
                .mockImplementationOnce((callback) => {
                    callback('err');
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.userAttributes(user);
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
            spyon2.mockClear();
        });
    });

    describe('currentSession', () => {
        test('happy case', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(CognitoUserPool.prototype, "getCurrentUser")
                .mockImplementationOnce(() => {
                    return user;
                });

            const spyon2 = jest.spyOn(Auth.prototype, 'userSession').mockImplementationOnce(() => {
                return new Promise((res, rej) => {
                    res(session);
                })
            });
            expect.assertions(1);
            expect(await auth.currentSession()).toEqual(session);

            spyon.mockClear();
            spyon2.mockClear();
        });

        test('callback failure', async () => {
            const auth = new Auth(authOptions);

            const spyon = jest.spyOn(CognitoUserPool.prototype, "getCurrentUser")
                .mockImplementationOnce(() => {
                    return null;
                });

            expect.assertions(1);
            try {
                await auth.currentSession();
            } catch (e) {
                expect(e).toBe('No current user');
            }

            spyon.mockClear();
        });

        test('no UserPool', async () => {
            const auth = new Auth({
                userPoolId: undefined,
                userPoolWebClientId: "awsUserPoolsWebClientId",
                region: "region",
                identityPoolId: "awsCognitoIdentityPoolId"
            });

            expect.assertions(1);
            try {
                await auth.currentSession();
            } catch (e) {
                expect(e).toBe('No userPool');
            }
        });
    });

    describe('currentAuthenticatedUser', () => {
        test('happy case with source userpool', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(Auth.prototype, 'currentUserPoolUser')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res(user);
                    });
                });

            expect.assertions(1);
            expect(await auth.currentAuthenticatedUser()).toEqual(user);

            spyon.mockClear();

        });

        test('happy case with source federation', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const spyon = jest.spyOn(Cache, 'getItem').mockImplementationOnce(() => {
                return 'federated_user';
            });

            expect.assertions(1);
            expect(await auth.currentAuthenticatedUser()).toBe('federated_user');

            spyon.mockClear();
        });
    });

    describe('userSession test', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'getSession').mockImplementationOnce((callback) => {
                callback(null, session);
            });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.userSession(user)).toEqual(session);

            spyon.mockClear();
        });

        test('CognitoSession not valid and refresh successfully', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'getSession').mockImplementationOnce((callback) => {
                callback(null, session);
            });

            const spyon2 = jest.spyOn(CognitoUserSession.prototype, 'isValid').mockImplementationOnce(() => {
                return false;
            });

            const spyon3 = jest.spyOn(CognitoUser.prototype, 'refreshSession').mockImplementationOnce((refreshToken, callback) => {
                callback(null, session);
            });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.userSession(user)).toEqual(session);

            spyon.mockClear();
            spyon2.mockClear();
            spyon3.mockClear();
        });

        test('CognitoSession not valid and refresh fails', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, 'getSession').mockImplementationOnce((callback) => {
                callback(null, session);
            });

            const spyon2 = jest.spyOn(CognitoUserSession.prototype, 'isValid').mockImplementationOnce(() => {
                return false;
            });

            const spyon3 = jest.spyOn(CognitoUser.prototype, 'refreshSession').mockImplementationOnce((refreshToken, callback) => {
                callback('err', null);
            });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.userSession(user);
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
            spyon2.mockClear();
            spyon3.mockClear();
        });

        test('callback error', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(CognitoUser.prototype, "getSession")
                .mockImplementationOnce((callback) => {
                    callback('err', null);
                });

            expect.assertions(1);
            try {
                await auth.userSession(user);
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        })
    });

    describe('currentUserCredentials test', () => {
        test('with federated info and not expired', async () => {
            const auth = new Auth(authOptions);

            const spyon = jest.spyOn(Cache, 'getItem')
                .mockImplementationOnce(() => {
                    return {
                        provider: 'google',
                        token: 'token'
                    }
                });

            expect.assertions(1);
            expect(await auth.currentUserCredentials()).not.toBeUndefined();

            spyon.mockClear();
        });

        test('with federated info and expired, then refresh it successfully', async () => {
            const auth = new Auth(authOptions);

            const spyon = jest.spyOn(Cache, 'getItem')
                .mockImplementationOnce(() => {
                    return {
                        provider: 'google',
                        token: 'token',
                        expires_at: 0
                    }
                });

            auth._refreshHandlers = {
                google: () => {
                    return Promise.resolve({
                        token: 'new_token',
                        expires_at: 1
                    });
                }
            }
            expect.assertions(1);
             expect(await auth.currentUserCredentials()).not.toBeUndefined();

            spyon.mockClear();
        });

        test('with federated info and expired, no refresh handler provided', async () => {
            const auth = new Auth(authOptions);

            const spyon = jest.spyOn(Cache, 'getItem')
                .mockImplementationOnce(() => {
                    return {
                        provider: 'google',
                        token: 'token',
                        expires_at: 0
                    }
                });

            auth._refreshHandlers = null;
            expect.assertions(1);
            try {
                await auth.currentUserCredentials();
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
        });

        test('with federated info and expired, then refresh failed', async () => {
            const auth = new Auth(authOptions);

            const spyon = jest.spyOn(Cache, 'getItem')
                .mockImplementationOnce(() => {
                    return {
                        provider: 'google',
                        token: 'token',
                        expires_at: 0
                    }
                });

            auth._refreshHandlers = {
                google: () => {
                    return Promise.reject('err');
                }
            }
            expect.assertions(1);
            try {
                await auth.currentUserCredentials();
            } catch (e) {
                expect(e).not.toBeNull();
            }

            spyon.mockClear();
        });


    });

    describe('currentCrendentials', () => {
        test('happy case when auth has credentials', async () => {
            const auth = new Auth(authOptions);
            const cred = new CognitoIdentityCredentials({
                    IdentityPoolId: 'identityPoolId',
                }, {
                    region: 'region'
                });
            cred.expired = false;
            cred.expireTime = (new Date().getTime()) * 2;

            auth['credentials'] = cred;

            expect.assertions(1);
            expect(await auth.currentCredentials()).not.toBeNull();

        });
    });


    describe('verifyUserAttribute test', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "getAttributeVerificationCode");

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.verifyUserAttribute(user, {})).toBe("success");

            spyon.mockClear();

        });

        test('onFailure', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "getAttributeVerificationCode")
                .mockImplementationOnce((attr, callback) => {
                    callback.onFailure('err');
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.verifyUserAttribute(user, {});
            } catch (e) {
                expect(e).toBe("err");
            }

            spyon.mockClear();
        });
    });

    describe('verifyUserAttributeSubmit', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "verifyAttribute");

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            expect(await auth.verifyUserAttributeSubmit(user, {}, 'code')).toBe("success");

            spyon.mockClear();
        });

        test('onFailure', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "verifyAttribute")
                .mockImplementationOnce((attr, code, callback) => {
                    callback.onFailure('err');
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.verifyUserAttributeSubmit(user, {}, 'code');
            } catch (e) {
                expect(e).toBe("err");
            }

            spyon.mockClear();
        });

        test('code empty', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.verifyUserAttributeSubmit(user, {}, null);
            } catch (e) {
                expect(e).toBe('Code cannot be empty');
            }
        });
    });

    describe('verifyCurrentUserAttribute test', () => {
        test('happy case', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(Auth.prototype, 'currentUserPoolUser')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res(user);
                    });
                });

            const spyon2 = jest.spyOn(Auth.prototype, 'verifyUserAttribute')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res();
                    });
                });

            await auth.verifyCurrentUserAttribute('attr');

            expect.assertions(2);
            expect(spyon).toBeCalled();
            expect(spyon2).toBeCalledWith(user, 'attr');

            spyon.mockClear();
            spyon2.mockClear();
        });
    });

    describe('verifyCurrentUserAttributeSubmit test', () => {
        test('happy case', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(Auth.prototype, 'currentUserPoolUser')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res(user);
                    });
                });

            const spyon2 = jest.spyOn(Auth.prototype, 'verifyUserAttributeSubmit')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res();
                    });
                });

            await auth.verifyCurrentUserAttributeSubmit('attr', 'code');

            expect.assertions(2);
            expect(spyon).toBeCalled();
            expect(spyon2).toBeCalledWith(user, 'attr', 'code');

            spyon.mockClear();
            spyon2.mockClear();
        });
    });

    describe('signOut', () => {
        test('happy case for all', async () => {
            const auth = new Auth(authOptions);
            auth['credentials'] = new CognitoIdentityCredentials({
                IdentityPoolId: 'identityPoolId'
            });
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });


            const spyonAuth = jest.spyOn(Auth.prototype, "currentUserCredentials")
            .mockImplementationOnce(() => {
                return new Promise((resolve, reject) => { resolve(); });
            });
            const spyon = jest.spyOn(CognitoIdentityCredentials.prototype, "clearCachedId");
            const spyon2 = jest.spyOn(Cache, 'removeItem');
            const spyon3 = jest.spyOn(CognitoUserPool.prototype, "getCurrentUser")
            .mockImplementationOnce(() => {
                return user;
            });

            await auth.signOut();

            expect.assertions(2);
            expect(spyon).toBeCalled();
            expect(spyon2).toBeCalledWith('federatedInfo');

            spyonAuth.mockClear();
            spyon.mockClear();
            spyon2.mockClear();
            spyon3.mockClear();
        });

        test('happy case for source userpool', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = 'aws';
            auth['credentials'] = new CognitoIdentityCredentials({
                IdentityPoolId: 'identityPoolId'
            });

            const spyonAuth = jest.spyOn(Auth.prototype, "currentUserCredentials")
            .mockImplementationOnce(() => {
                return new Promise((resolve, reject) => { resolve(); });
            });
            const spyon = jest.spyOn(CognitoUserPool.prototype, "getCurrentUser")
            .mockImplementationOnce(() => {
                return user;
            });
            const spyon2 = jest.spyOn(CognitoUser.prototype, "signOut");
            // @ts-ignore

            await auth.signOut();

            expect.assertions(1);
            expect(spyon2).toBeCalled();

            spyonAuth.mockClear();
            spyon.mockClear();
            spyon2.mockClear();
        });

        test('happy case for source userpool with mandatorySignIn', async () => {
            const auth = new Auth({
                ...authOptions,
                mandatorySignIn: true,
            });
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = 'aws';
            auth['credentials'] = new CognitoIdentityCredentials({
                IdentityPoolId: 'identityPoolId'
            });

            const spyonAuth = jest.spyOn(Auth.prototype, "currentUserCredentials")
                .mockImplementationOnce(() => {
                    return new Promise((resolve, reject) => { resolve(); });
                });
            const spyon = jest.spyOn(CognitoUserPool.prototype, "getCurrentUser")
                .mockImplementationOnce(() => {
                    return user;
                });
            const spyon2 = jest.spyOn(CognitoUser.prototype, "signOut");
            // @ts-ignore

            await auth.signOut();

            expect.assertions(3);
            expect(spyon2).toBeCalled();
            expect(auth['credentials_source']).toBe('');
            expect(auth['credentials']).toBeNull();

            spyonAuth.mockClear();
            spyon.mockClear();
            spyon2.mockClear();
        });

        test('no UserPool', async () => {
            const auth = new Auth(authOptionsWithNoUserPoolId);
            auth['credentials_source'] = 'aws';
            auth['credentials'] = new CognitoIdentityCredentials({
                IdentityPoolId: 'identityPoolId'
            });

            const spyonAuth = jest.spyOn(Auth.prototype, "currentUserCredentials")
            .mockImplementationOnce(() => {
                return new Promise((resolve, reject) => { resolve(); });
            });
            expect.assertions(1);
            try {
                await auth.signOut();
            } catch (e) {
                expect(e).toBe('No userPool');
            }

            spyonAuth.mockClear();
        });

        test('no User in userpool', async () => {
            const auth = new Auth(authOptions);
            auth['credentials_source'] = 'aws';
            auth['credentials'] = new CognitoIdentityCredentials({
                IdentityPoolId: 'identityPoolId'
            });

            const spyonAuth = jest.spyOn(Auth.prototype, "currentUserCredentials")
            .mockImplementationOnce(() => {
                return new Promise((resolve, reject) => { resolve(); });
            });
            const spyon = jest.spyOn(CognitoUserPool.prototype, 'getCurrentUser')
                .mockImplementationOnce(() => {
                    return null;
                });


            expect.assertions(1);
            expect(await auth.signOut()).toBeUndefined();

            spyonAuth.mockClear();
            spyon.mockClear();
        });
    });

    describe('changePassword', () => {
        test('happy case', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const oldPassword = 'oldPassword1';
            const newPassword = 'newPassword1.';

            const spyon = jest.spyOn(Auth.prototype, 'userSession').mockImplementationOnce(() => {
                return new Promise((res, rej) => {
                    res(session);
                })
            });

            expect.assertions(1);
            expect(await auth.changePassword(user, oldPassword, newPassword)).toBe('SUCCESS');

            spyon.mockClear();
        });
    });

    describe('forgotPassword', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "forgotPassword");

            const auth = new Auth(authOptions);

            expect.assertions(1);
            expect(await auth.forgotPassword('username')).toBeUndefined();

            spyon.mockClear();
        });

        test('onFailue', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "forgotPassword")
                .mockImplementationOnce((callback) => {
                    callback.onFailure('err');
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.forgotPassword('username');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('inputVerficationCode', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "forgotPassword")
                .mockImplementationOnce((callback) => {
                    callback.inputVerificationCode('data');
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            expect(await auth.forgotPassword('username')).toBe('data');

            spyon.mockClear();
        });

        test('no user pool id', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "forgotPassword");

            const auth = new Auth(authOptionsWithNoUserPoolId);

            expect.assertions(1);
            try {
                await auth.forgotPassword('username');
            } catch (e) {
                expect(e).not.toBeNull();
            }
            spyon.mockClear();
        });

        test('no username', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "forgotPassword");

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.forgotPassword(null);
            } catch (e) {
                expect(e).not.toBeNull();
            }
            spyon.mockClear();
        });
    });

    describe('forgotPasswordSubmit', () => {
        test('happy case', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "confirmPassword");

            const auth = new Auth(authOptions);

            expect.assertions(1);
            expect(await auth.forgotPasswordSubmit('username', 'code', 'password')).toBeUndefined();

            spyon.mockClear();
        });

        test('confirmPassword failed', async () => {
            const spyon = jest.spyOn(CognitoUser.prototype, "confirmPassword")
                .mockImplementationOnce((code, password, callback) => {
                    callback.onFailure('err');
                });

            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.forgotPasswordSubmit('username', 'code', 'password');
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
        });

        test('no user pool', async () => {
            const auth = new Auth(authOptionsWithNoUserPoolId);

            expect.assertions(1);
            try {
                await auth.forgotPasswordSubmit('username', 'code', 'password');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('no username', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.forgotPasswordSubmit(null, 'code', 'password');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('no code', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.forgotPasswordSubmit('username', null, 'password');
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });

        test('no password', async () => {
            const auth = new Auth(authOptions);

            expect.assertions(1);
            try {
                await auth.forgotPasswordSubmit('username', 'code', null);
            } catch (e) {
                expect(e).not.toBeNull();
            }
        });
    });

    describe('currentUserInfo test', () => {
        test('happy case with aws or userpool source', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = 'aws';

            const spyon = jest.spyOn(Auth.prototype, 'currentUserPoolUser')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res({
                            username: 'username'
                        });
                    });
                });

            const spyon2 = jest.spyOn(Auth.prototype, 'userAttributes')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej)=> {
                        res([
                            {Name: 'email', Value: 'email'},
                            {Name: 'phone_number', Value : 'phone_number'},
                            {Name: 'email_verified', Value: 'false'},
                            {Name: 'phone_number_verified', Value: 'true'},
                            {Name: 'sub', Value: 'fefefe'}
                        ]);
                    });
                });

            const spyon3 = jest.spyOn(Auth.prototype, 'currentCredentials').mockImplementationOnce(() => {
                auth['credentials'] = {
                    identityId: 'identityId'
                }
                return Promise.resolve();
            });

            expect.assertions(1);
            expect(await auth.currentUserInfo()).toEqual({
                username: 'username',
                id: 'identityId',
                attributes: {
                    email: 'email',
                    phone_number: 'phone_number',
                    email_verified: false,
                    phone_number_verified: true
                }
            });

            spyon.mockClear();
            spyon2.mockClear();
        });

        test('return empty object if error happens', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = 'aws';
            auth['credentials'] = new CognitoIdentityCredentials({
                IdentityPoolId: 'identityPoolId',
                IdentityId: 'identityId'
            });

            const spyon = jest.spyOn(Auth.prototype, 'currentUserPoolUser')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res({
                            username: 'username'
                        });
                    });
                });

            const spyon2 = jest.spyOn(Auth.prototype, 'userAttributes')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej)=> {
                        rej('err')
                    });
                });

            expect.assertions(1);
            expect(await auth.currentUserInfo()).toEqual({});

            spyon.mockClear();
            spyon2.mockClear();
        });

        test('no credentials source', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = null;


            expect.assertions(1);
            expect(await auth.currentUserInfo()).toEqual(null);
        });

        test('no current userpool user', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = 'aws';

            const spyon = jest.spyOn(Auth.prototype, 'currentUserPoolUser')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res(null);
                    });
                });

            expect.assertions(1);
            expect(await auth.currentUserInfo()).toBeNull();

            spyon.mockClear();
        });

        test('federated user', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            auth['credentials_source'] = 'federated';
            auth['user'] = 'federated_user';

            expect.assertions(1);
            expect(await auth.currentUserInfo()).toBe('federated_user');
        });
    });

    describe('updateUserAttributes test', () => {
        test('happy case', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });
            const attributes = {
                'email': 'email',
                'phone_number': 'phone_number',
                'sub': 'sub'
            }
            const spyon = jest.spyOn(Auth.prototype, 'userSession').mockImplementationOnce(() => {
                return new Promise((res, rej) => {
                    res(session);
                })
            });
            
            expect.assertions(1);
            expect(await auth.updateUserAttributes(user,attributes)).toBe('SUCCESS');

            spyon.mockClear();
        });
    });

    describe('federatedSignIn test', () => {
        test('happy case', () => {
            const auth = new Auth(authOptions);

            const spyon = jest.spyOn(Cache, 'setItem').mockImplementationOnce(() => {
                return;
            });

            auth.federatedSignIn('google', {token: 'token', expires_at: 'expires_at'}, 'user');

            expect(spyon).toBeCalledWith('federatedInfo', {
                provider: 'google',
                token: 'token',
                user: 'user',
                expires_at: 'expires_at'
            },
            {
                priority: 1
            });
            spyon.mockClear();
        });
    });

    describe('verifiedContact test', () => {
        test('happy case with unverified', async () => {
            const spyon = jest.spyOn(Auth.prototype, 'userAttributes')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res([{
                            Name: 'email',
                            Value: 'email@amazon.com'
                        },
                        {
                            Name: 'phone_number',
                            Value: '+12345678901'
                        }])
                    });
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect(await auth.verifiedContact(user)).toEqual({
                "unverified": {"email": "email@amazon.com", "phone_number": "+12345678901"},
                "verified": {}
            });

            spyon.mockClear();
        });

        test('happy case with unverified', async () => {
            const spyon = jest.spyOn(Auth.prototype, 'userAttributes')
                .mockImplementationOnce(() => {
                    return new Promise((res, rej) => {
                        res([{
                            Name: 'email',
                            Value: 'email@amazon.com'
                        },
                        {
                            Name: 'phone_number',
                            Value: '+12345678901'
                        },
                        {
                            Name: 'email_verified',
                            Value: true
                        },
                        {
                            Name: 'phone_number_verified',
                            Value: true
                        }])
                    });
                });

            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect(await auth.verifiedContact(user)).toEqual({
                "unverified": {},
                "verified": {"email": "email@amazon.com", "phone_number": "+12345678901"}
            });

            spyon.mockClear();
        });
    });

    describe('currentUserPoolUser test', () => {
        test('happy case', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(CognitoUserPool.prototype, 'getCurrentUser')
                .mockImplementation(() => {
                    return user;
                });
            const spyon2 = jest.spyOn(CognitoUser.prototype, 'getSession')
                .mockImplementation((callback) => {
                    return callback(null, 'session');
                });

            expect.assertions(1);
            auth.currentUserPoolUser()
                .then((user) => {
                    expect(user).toEqual(user);
                    spyon.mockClear();
                    spyon2.mockClear();
                })
                .catch((e) => {
                    expect(e).toBe('No current user in userPool');
                });

            //expect(await auth.currentUserPoolUser()).toEqual(user);
        });

        test('no current user', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(CognitoUserPool.prototype, 'getCurrentUser')
                .mockImplementation(() => {
                    return null;
                });

            expect.assertions(1);
            try {
                await auth.currentUserPoolUser()
            } catch (e) {
                expect(e).toBe('No current user in userPool');
            }

            spyon.mockClear();
        });

        test('No userPool', async () => {
            const auth = new Auth(authOptionsWithNoUserPoolId);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            expect.assertions(1);
            try {
                await auth.currentUserPoolUser()
            } catch (e) {
                expect(e).toBe('No userPool');
            }
        });

        test('get session error', async () => {
            const auth = new Auth(authOptions);
            const user = new CognitoUser({
                Username: 'username',
                Pool: userPool
            });

            const spyon = jest.spyOn(CognitoUserPool.prototype, 'getCurrentUser')
                .mockImplementation(() => {
                    return user;
                });
            const spyon2 = jest.spyOn(CognitoUser.prototype, 'getSession')
                .mockImplementation((callback) => {
                    return callback('err', null);
                });

            expect.assertions(1);
            try {
                await auth.currentUserPoolUser()
            } catch (e) {
                expect(e).toBe('err');
            }

            spyon.mockClear();
            spyon2.mockClear();
        });
    });

    describe('hosted ui test', () => {
        test('happy case', () => {
            const oauth = {};

            const authOptions = {
                Auth: {
                    userPoolId: "awsUserPoolsId",
                    userPoolWebClientId: "awsUserPoolsWebClientId",
                    region: "region",
                    identityPoolId: "awsCognitoIdentityPoolId",
                    oauth
                }
            };
            const spyon = jest.spyOn(Auth.prototype, 'currentAuthenticatedUser').mockImplementationOnce(() => {
                return Promise.reject('err');
            });


            const auth = new Auth(authOptions);
            expect(spyon).toBeCalled();

            spyon.mockClear();
          
        });
    });
});


    

