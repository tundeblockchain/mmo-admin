import { type User, onAuthStateChanged } from 'firebase/auth';
import { env } from '../config/env';
import { firebaseAuth } from '../config/firebase';
import {
  getE2EAuthUser,
  installE2EEmailPasswordHarness,
  isE2EAuthEnabled,
  subscribeToE2EAuth,
  toE2EFirebaseUser,
} from './e2eAuthBridge';

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' };

let currentAuthState: AuthState = { status: 'loading' };
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function applyFirebaseUser(user: User | null): void {
  if (user) {
    currentAuthState = { status: 'authenticated', user };
  } else {
    currentAuthState = { status: 'unauthenticated' };
  }
  notifyListeners();
}

function applyE2EAuthState(): void {
  const user = getE2EAuthUser();
  applyFirebaseUser(user ? toE2EFirebaseUser(user) : null);
}

if (env.e2e && isE2EAuthEnabled()) {
  applyE2EAuthState();
  subscribeToE2EAuth(applyE2EAuthState);
} else {
  onAuthStateChanged(firebaseAuth, applyFirebaseUser);
}

installE2EEmailPasswordHarness();

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

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const state = currentAuthState;
  if (state.status === 'authenticated') {
    return state.user.getIdToken(forceRefresh);
  }
  return null;
}
