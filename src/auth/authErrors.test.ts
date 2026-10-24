import { describe, expect, it } from 'vitest';
import { AUTH_MESSAGES } from './authMessages';
import {
  toRegisterErrorMessage,
  toSignInErrorMessage,
  toVerifyErrorMessage,
} from './authErrors';
import { firebaseAuthError } from '../test/mocks/firebase-auth';

describe('auth error mapping', () => {
  it('uses one generic sign-in message for unknown, missing, or wrong credentials', () => {
    expect(toSignInErrorMessage(firebaseAuthError('auth/user-not-found', 'no user'))).toBe(
      AUTH_MESSAGES.invalidCredentials,
    );
    expect(toSignInErrorMessage(firebaseAuthError('auth/wrong-password', 'bad pass'))).toBe(
      AUTH_MESSAGES.invalidCredentials,
    );
    expect(
      toSignInErrorMessage(firebaseAuthError('auth/invalid-credential', 'invalid')),
    ).toBe(AUTH_MESSAGES.invalidCredentials);
    expect(toSignInErrorMessage(new Error('user-not-found'))).toBe(
      AUTH_MESSAGES.genericSignIn,
    );
  });

  it('does not reveal that an email is already registered', () => {
    expect(
      toRegisterErrorMessage(firebaseAuthError('auth/email-already-in-use', 'taken')),
    ).toBe(AUTH_MESSAGES.genericRegister);
    expect(toRegisterErrorMessage(firebaseAuthError('auth/user-not-found'))).toBe(
      AUTH_MESSAGES.genericRegister,
    );
  });

  it('keeps format and rate-limit messages that do not enumerate accounts', () => {
    expect(toSignInErrorMessage(firebaseAuthError('auth/invalid-email'))).toBe(
      AUTH_MESSAGES.invalidEmail,
    );
    expect(toRegisterErrorMessage(firebaseAuthError('auth/weak-password'))).toBe(
      AUTH_MESSAGES.weakPassword,
    );
    expect(toVerifyErrorMessage(firebaseAuthError('auth/too-many-requests'))).toBe(
      AUTH_MESSAGES.tooManyRequests,
    );
  });
});
