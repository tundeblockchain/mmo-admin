import { vi } from 'vitest';
import { type User } from 'firebase/auth';

type AuthStateCallback = (user: User | null) => void;

const hoisted = vi.hoisted(() => {
  const state = {
    authStateCallback: null as AuthStateCallback | null,
    currentUser: null as User | null,
  };

  return {
    state,
    mockAuth: {
      get currentUser() {
        return state.currentUser;
      },
    },
    mockSignInWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'test-uid-123' } }),
    mockSignInWithEmailAndPassword: vi.fn().mockResolvedValue({
      user: { uid: 'test-uid-123', emailVerified: true },
    }),
    mockCreateUserWithEmailAndPassword: vi.fn().mockResolvedValue({
      user: { uid: 'test-uid-123', emailVerified: false },
    }),
    mockSendEmailVerification: vi.fn().mockResolvedValue(undefined),
    mockSendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
    mockSignOut: vi.fn(async () => {
      state.currentUser = null;
      state.authStateCallback?.(null);
    }),
    mockOnAuthStateChanged: vi.fn(),
  };
});

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => {
  class MockGoogleAuthProvider {}

  return {
    getAuth: vi.fn(() => hoisted.mockAuth),
    onAuthStateChanged: hoisted.mockOnAuthStateChanged,
    signInWithPopup: hoisted.mockSignInWithPopup,
    signInWithEmailAndPassword: hoisted.mockSignInWithEmailAndPassword,
    createUserWithEmailAndPassword: hoisted.mockCreateUserWithEmailAndPassword,
    sendEmailVerification: hoisted.mockSendEmailVerification,
    sendPasswordResetEmail: hoisted.mockSendPasswordResetEmail,
    signOut: hoisted.mockSignOut,
    GoogleAuthProvider: MockGoogleAuthProvider,
  };
});

export const mockSignInWithPopup = hoisted.mockSignInWithPopup;
export const mockSignInWithEmailAndPassword = hoisted.mockSignInWithEmailAndPassword;
export const mockCreateUserWithEmailAndPassword =
  hoisted.mockCreateUserWithEmailAndPassword;
export const mockSendEmailVerification = hoisted.mockSendEmailVerification;
export const mockSendPasswordResetEmail = hoisted.mockSendPasswordResetEmail;
export const mockSignOut = hoisted.mockSignOut;
export const mockOnAuthStateChanged = hoisted.mockOnAuthStateChanged;

export type MockAuthUser = Omit<User, 'emailVerified'> & {
  emailVerified: boolean;
};

function createMockUser(overrides: Partial<MockAuthUser> = {}): MockAuthUser {
  return {
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
    reload: vi.fn().mockResolvedValue(undefined),
    toJSON: vi.fn(),
    phoneNumber: null,
    providerId: 'password',
    ...overrides,
  } as MockAuthUser;
}

export const mockUser = createMockUser({ providerId: 'google.com' });
export const mockUnverifiedUser = createMockUser({ emailVerified: false });

export function firebaseAuthError(code: string, message = code): Error & { code: string } {
  return Object.assign(new Error(message), { code });
}

export function setMockAuthState(user: User | null) {
  hoisted.state.currentUser = user;
  if (hoisted.state.authStateCallback) {
    hoisted.state.authStateCallback(user);
  }
}

function setupOnAuthStateChangedMock() {
  hoisted.mockOnAuthStateChanged.mockImplementation(
    (_auth: unknown, callback: AuthStateCallback) => {
      hoisted.state.authStateCallback = callback;
      callback(hoisted.state.currentUser);
      return () => {};
    },
  );
}

setupOnAuthStateChangedMock();

export function resetMockAuth() {
  hoisted.state.currentUser = null;
  mockUnverifiedUser.emailVerified = false;
  vi.mocked(mockUser.getIdToken).mockClear().mockResolvedValue('mock-id-token');
  vi.mocked(mockUser.reload).mockClear().mockResolvedValue(undefined);
  vi.mocked(mockUnverifiedUser.getIdToken).mockClear().mockResolvedValue('mock-id-token');
  vi.mocked(mockUnverifiedUser.reload).mockClear().mockResolvedValue(undefined);
  hoisted.mockSignInWithPopup.mockClear();
  hoisted.mockSignInWithEmailAndPassword.mockClear();
  hoisted.mockCreateUserWithEmailAndPassword.mockClear();
  hoisted.mockSendEmailVerification.mockClear();
  hoisted.mockSendPasswordResetEmail.mockClear();
  hoisted.mockSignOut.mockClear();
  hoisted.mockOnAuthStateChanged.mockClear();
  setupOnAuthStateChangedMock();
}
