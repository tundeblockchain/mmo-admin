import { signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../config/firebase';

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(firebaseAuth, googleProvider);
}

export async function signOutUser(): Promise<void> {
  await signOut(firebaseAuth);
}
