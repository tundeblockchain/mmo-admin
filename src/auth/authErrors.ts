import { AUTH_MESSAGES } from './authMessages';

const INVALID_CREDENTIAL_CODES = new Set([
  'auth/user-not-found',
  'auth/wrong-password',
  'auth/invalid-credential',
  'auth/invalid-login-credentials',
  'auth/missing-password',
]);

const REGISTER_SAFE_CODES = new Set([
  'auth/email-already-in-use',
  'auth/credential-already-in-use',
]);

function getFirebaseErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  const code = error.code;
  return typeof code === 'string' ? code : null;
}

function messageForSharedCode(code: string): string | null {
  if (code === 'auth/invalid-email') {
    return AUTH_MESSAGES.invalidEmail;
  }
  if (code === 'auth/weak-password') {
    return AUTH_MESSAGES.weakPassword;
  }
  if (code === 'auth/too-many-requests') {
    return AUTH_MESSAGES.tooManyRequests;
  }
  if (code === 'auth/network-request-failed') {
    return AUTH_MESSAGES.network;
  }
  return null;
}

export function toSignInErrorMessage(error: unknown): string {
  const code = getFirebaseErrorCode(error);
  if (code && INVALID_CREDENTIAL_CODES.has(code)) {
    return AUTH_MESSAGES.invalidCredentials;
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return AUTH_MESSAGES.googleCancelled;
  }
  return messageForSharedCode(code ?? '') ?? AUTH_MESSAGES.genericSignIn;
}

export function toRegisterErrorMessage(error: unknown): string {
  const code = getFirebaseErrorCode(error);
  if (code && (REGISTER_SAFE_CODES.has(code) || INVALID_CREDENTIAL_CODES.has(code))) {
    return AUTH_MESSAGES.genericRegister;
  }
  return messageForSharedCode(code ?? '') ?? AUTH_MESSAGES.genericRegister;
}

export function toVerifyErrorMessage(error: unknown): string {
  const code = getFirebaseErrorCode(error);
  return messageForSharedCode(code ?? '') ?? AUTH_MESSAGES.genericVerify;
}
