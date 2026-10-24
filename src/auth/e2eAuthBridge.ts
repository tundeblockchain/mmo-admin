import { signInWithEmailAndPassword, type User } from 'firebase/auth';
import { env } from '../config/env';
import { firebaseAuth } from '../config/firebase';

export interface E2EAuthUser {
  uid: string;
  email: string;
  displayName: string;
  idToken: string;
}

export interface E2EAuthBridgeState {
  enabled: boolean;
  user?: E2EAuthUser | null;
}

declare global {
  interface Window {
    __E2E_AUTH__?: E2EAuthBridgeState;
    __E2E_SIGN_IN_WITH_EMAIL_PASSWORD__?: (
      email: string,
      password: string,
    ) => Promise<void>;
  }
}

const listeners = new Set<() => void>();

function readBridge(): E2EAuthBridgeState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.__E2E_AUTH__;
  if (!value || typeof value !== 'object' || value.enabled !== true) {
    return null;
  }

  return value;
}

function isE2EAuthUser(value: unknown): value is E2EAuthUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Partial<E2EAuthUser>;
  return (
    typeof user.uid === 'string' &&
    typeof user.email === 'string' &&
    typeof user.displayName === 'string' &&
    typeof user.idToken === 'string'
  );
}

function readInitialUser(): E2EAuthUser | null {
  const user = readBridge()?.user;
  return isE2EAuthUser(user) ? user : null;
}

let currentUser: E2EAuthUser | null = readInitialUser();

function notifyListeners(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

export function isE2EAuthEnabled(): boolean {
  return readBridge() !== null;
}

export function getE2EAuthUser(): E2EAuthUser | null {
  return currentUser;
}

export function subscribeToE2EAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function e2eSignIn(user: E2EAuthUser): void {
  currentUser = user;
  if (typeof window !== 'undefined' && window.__E2E_AUTH__) {
    window.__E2E_AUTH__ = {
      ...window.__E2E_AUTH__,
      enabled: true,
      user,
    };
  }
  notifyListeners();
}

export function e2eSignOut(): void {
  currentUser = null;
  if (typeof window !== 'undefined' && window.__E2E_AUTH__) {
    window.__E2E_AUTH__ = {
      ...window.__E2E_AUTH__,
      enabled: true,
      user: null,
    };
  }
  notifyListeners();
}

export function installE2EEmailPasswordHarness(): void {
  if (!env.e2e || typeof window === 'undefined') {
    return;
  }

  window.__E2E_SIGN_IN_WITH_EMAIL_PASSWORD__ = async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  };
}

export function toE2EFirebaseUser(user: E2EAuthUser): User {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: 'e2e-refresh-token',
    tenantId: null,
    delete: async () => undefined,
    getIdToken: async () => user.idToken,
    getIdTokenResult: async () => ({
      token: user.idToken,
      authTime: '',
      issuedAtTime: '',
      expirationTime: '',
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {},
    }),
    reload: async () => undefined,
    toJSON: () => ({ uid: user.uid, email: user.email }),
    phoneNumber: null,
    providerId: 'password',
  } as unknown as User;
}
