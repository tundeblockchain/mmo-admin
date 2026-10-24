import { beforeEach } from 'vitest';
import { mockUser, resetMockAuth, setMockAuthState } from './mocks/firebase-auth';

export function setupSignedInAuth(): void {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(mockUser);
  });
}
