import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  mockUser,
  setMockAuthState,
  resetMockAuth,
} from '../test/mocks/firebase-auth';
import { getIdToken, getAuthSnapshot } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    resetMockAuth();
    vi.mocked(mockUser.getIdToken).mockClear();
  });

  describe('getAuthSnapshot', () => {
    it('returns authenticated state with user after auth state change', () => {
      setMockAuthState(mockUser);
      const state = getAuthSnapshot();

      expect(state.status).toBe('authenticated');
      if (state.status === 'authenticated') {
        expect(state.user).toBe(mockUser);
      }
    });

    it('returns unauthenticated state when user is null', () => {
      setMockAuthState(null);
      const state = getAuthSnapshot();

      expect(state.status).toBe('unauthenticated');
    });
  });

  describe('getIdToken', () => {
    it('returns null when unauthenticated', async () => {
      setMockAuthState(null);
      const token = await getIdToken();
      expect(token).toBeNull();
    });

    it('returns token when authenticated', async () => {
      setMockAuthState(mockUser);
      const token = await getIdToken();
      expect(token).toBe('mock-id-token');
    });

    it('calls user.getIdToken without forcing refresh by default', async () => {
      setMockAuthState(mockUser);
      await getIdToken();
      expect(mockUser.getIdToken).toHaveBeenCalledWith(false);
    });

    it('forwards forceRefresh to Firebase getIdToken', async () => {
      setMockAuthState(mockUser);
      await getIdToken(true);
      expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
    });
  });
});
