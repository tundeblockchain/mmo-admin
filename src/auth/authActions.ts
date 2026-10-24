import { signInWithPopup, signOut } from 'firebase/auth';
import { env } from '../config/env';
import { firebaseAuth, googleProvider } from '../config/firebase';
import { e2eSignIn, e2eSignOut, isE2EAuthEnabled } from './e2eAuthBridge';

function isE2EAuthStubActive(): boolean {
  return env.e2e && isE2EAuthEnabled();
}

export async function signInWithGoogle(): Promise<void> {
  if (isE2EAuthStubActive()) {
    e2eSignIn({
      uid: 'e2e-signed-in-user',
      email: 'admin@example.com',
      displayName: 'E2E User',
      idToken: 'e2e-admin-token',
    });
    return;
  }

  await signInWithPopup(firebaseAuth, googleProvider);
}

export async function signOutUser(): Promise<void> {
  if (isE2EAuthStubActive()) {
    e2eSignOut();
    return;
  }

  await signOut(firebaseAuth);
}
