import { vi } from 'vitest';
import { type User } from 'firebase/auth';

type AuthStateCallback = (user: User | null) => void;

interface MockState {
  authStateCallback: AuthStateCallback | null;
  currentUser: User | null;
}

const mockState: MockState = {
  authStateCallback: null,
  currentUser: null,
};

const hoisted = vi.hoisted(() => {
  return {
    mockSignInWithPopup: vi.fn().mockResolvedValue({
      user: {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        isAnonymous: false,
        getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
      },
    }),
    mockSignOut: vi.fn().mockResolvedValue(undefined),
    mockOnAuthStateChanged: vi.fn(),
  };
});

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => {
  class MockGoogleAuthProvider {}

  return {
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: hoisted.mockOnAuthStateChanged,
    signInWithPopup: hoisted.mockSignInWithPopup,
    signOut: hoisted.mockSignOut,
    GoogleAuthProvider: MockGoogleAuthProvider,
  };
});

export const mockSignInWithPopup = hoisted.mockSignInWithPopup;
export const mockSignOut = hoisted.mockSignOut;
export const mockOnAuthStateChanged = hoisted.mockOnAuthStateChanged;

export const mockUser: User = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
  phoneNumber: null,
  providerId: 'google.com',
} as unknown as User;

export function setMockAuthState(user: User | null) {
  mockState.currentUser = user;
  if (mockState.authStateCallback) {
    mockState.authStateCallback(user);
  }
}

function setupOnAuthStateChangedMock() {
  hoisted.mockOnAuthStateChanged.mockImplementation(
    (_auth: unknown, callback: AuthStateCallback) => {
      mockState.authStateCallback = callback;
      callback(mockState.currentUser);
      return () => {};
    },
  );
}

setupOnAuthStateChangedMock();

export function resetMockAuth() {
  mockState.currentUser = null;
  hoisted.mockSignInWithPopup.mockClear();
  hoisted.mockSignOut.mockClear();
  hoisted.mockOnAuthStateChanged.mockClear();
  setupOnAuthStateChangedMock();
}
