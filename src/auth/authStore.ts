import { type User, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase';

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' };

let currentAuthState: AuthState = { status: 'loading' };
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    currentAuthState = { status: 'authenticated', user };
  } else {
    currentAuthState = { status: 'unauthenticated' };
  }
  notifyListeners();
});

export function subscribeToAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthState {
  return currentAuthState;
}

export function getAuthServerSnapshot(): AuthState {
  return { status: 'loading' };
}

export async function getIdToken(): Promise<string | null> {
  const state = currentAuthState;
  if (state.status === 'authenticated') {
    return state.user.getIdToken();
  }
  return null;
}
