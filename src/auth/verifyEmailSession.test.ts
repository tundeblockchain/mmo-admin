import { describe, expect, it, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { AUTH_MESSAGES } from './authMessages';
import { getAuthSnapshot } from './authStore';
import { confirmEmailVerified } from './verifyEmailSession';
import { server } from '../test/mocks/server';
import {
  mockUnverifiedUser,
  resetMockAuth,
  setMockAuthState,
} from '../test/mocks/firebase-auth';

describe('confirmEmailVerified', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(mockUnverifiedUser);
  });

  it('refreshes the ID token then re-POSTs /users/me after verification', async () => {
    const order: string[] = [];
    vi.mocked(mockUnverifiedUser.reload).mockImplementation(async () => {
      mockUnverifiedUser.emailVerified = true;
      order.push('reload');
    });
    vi.mocked(mockUnverifiedUser.getIdToken).mockImplementation(async (force) => {
      order.push(force === true ? 'refresh' : 'token');
      return force === true ? 'refreshed-token' : 'mock-id-token';
    });

    server.use(
      http.post('*/users/me', ({ request }) => {
        order.push(`post:${request.headers.get('Authorization')}`);
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'admin' });
      }),
    );

    await confirmEmailVerified();

    expect(order).toEqual([
      'reload',
      'refresh',
      'token',
      'post:Bearer mock-id-token',
    ]);
    expect(mockUnverifiedUser.getIdToken).toHaveBeenCalledWith(true);

    const state = getAuthSnapshot();
    expect(state.status).toBe('authenticated');
    if (state.status === 'authenticated') {
      expect(state.user.emailVerified).toBe(true);
    }
  });

  it('does not POST /users/me when the email is still unverified', async () => {
    let posts = 0;
    server.use(
      http.post('*/users/me', () => {
        posts += 1;
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'admin' });
      }),
    );

    await expect(confirmEmailVerified()).rejects.toThrow(AUTH_MESSAGES.stillUnverified);
    expect(posts).toBe(0);
    expect(mockUnverifiedUser.getIdToken).not.toHaveBeenCalledWith(true);
  });
});
