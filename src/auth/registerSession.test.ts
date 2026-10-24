import { describe, expect, it, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { isAdminAccountType } from '../types/account';
import { server } from '../test/mocks/server';
import {
  mockUnverifiedUser,
  resetMockAuth,
  setMockAuthState,
} from '../test/mocks/firebase-auth';
import { provisionRegisteredUser } from './registerSession';

describe('provisionRegisteredUser', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(null);
  });

  it('refreshes the token then POSTs /users/me without assuming admin', async () => {
    const order: string[] = [];
    let capturedBody: unknown = null;

    vi.mocked(mockUnverifiedUser.getIdToken).mockImplementation(async (force) => {
      order.push(force === true ? 'refresh' : 'token');
      return force === true ? 'refreshed-token' : 'mock-id-token';
    });

    server.use(
      http.post('*/users/me', async ({ request }) => {
        const text = await request.text();
        capturedBody = text ? JSON.parse(text) : {};
        order.push(`post:${request.headers.get('Authorization')}`);
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'player' });
      }),
    );

    const result = await provisionRegisteredUser(mockUnverifiedUser);

    expect(order).toEqual(['refresh', 'token', 'post:Bearer mock-id-token']);
    expect(mockUnverifiedUser.getIdToken).toHaveBeenCalledWith(true);
    expect(capturedBody).not.toEqual(expect.objectContaining({ accountType: 'admin' }));
    expect(result.accountType).toBe('player');
    expect(isAdminAccountType(result.accountType)).toBe(false);
  });
});
