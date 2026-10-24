import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { env } from '../config/env';
import { firebaseAuth, googleProvider } from '../config/firebase';
import { e2eSignIn, e2eSignOut, isE2EAuthEnabled } from './e2eAuthBridge';

function isE2EAuthStubActive(): boolean {
  return env.e2e && isE2EAuthEnabled();
}

function signInE2EUser(email: string): void {
  e2eSignIn({
    uid: 'e2e-signed-in-user',
    email,
    displayName: 'E2E User',
    idToken: 'e2e-admin-token',
  });
}

function registerE2EUser(email: string): void {
  e2eSignIn({
    uid: 'e2e-registered-user',
    email,
    displayName: 'E2E User',
    idToken: 'e2e-player-token',
    emailVerified: false,
  });
}

export async function signInWithGoogle(): Promise<void> {
  if (isE2EAuthStubActive()) {
    signInE2EUser('admin@example.com');
    return;
  }

  await signInWithPopup(firebaseAuth, googleProvider);
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<void> {
  if (isE2EAuthStubActive()) {
    signInE2EUser(email);
    return;
  }

  await signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
): Promise<User | null> {
  if (isE2EAuthStubActive()) {
    registerE2EUser(email);
    return null;
  }

  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  if (!credential.user) {
    return null;
  }

  try {
    await sendEmailVerification(credential.user);
  } catch {
    // The verify screen can resend if the first email does not send.
  }

  return credential.user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (isE2EAuthStubActive()) {
    return;
  }

  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch {
    // Always present the same generic success copy to callers.
  }
}

export async function resendVerificationEmail(): Promise<void> {
  if (isE2EAuthStubActive()) {
    return;
  }

  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('Not signed in');
  }

  await sendEmailVerification(user);
}

export async function signOutUser(): Promise<void> {
  if (isE2EAuthStubActive()) {
    e2eSignOut();
    return;
  }

  await signOut(firebaseAuth);
}
