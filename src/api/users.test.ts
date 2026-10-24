import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { ApiError } from '../lib/errors';
import { syncCurrentUser } from './users';

vi.mock('../auth', () => ({
  getIdToken: vi.fn(),
}));

import { getIdToken } from '../auth';

describe('syncCurrentUser', () => {
  beforeEach(() => {
    vi.mocked(getIdToken).mockResolvedValue('mock-firebase-id-token');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('POSTs /users/me with the Bearer token', async () => {
    let capturedAuthHeader: string | null = null;

    server.use(
      http.post('*/users/me', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization');
        return HttpResponse.json({ uid: 'user-1', accountType: 'admin' });
      }),
    );

    const result = await syncCurrentUser();

    expect(capturedAuthHeader).toBe('Bearer mock-firebase-id-token');
    expect(result).toEqual({ uid: 'user-1', accountType: 'admin' });
  });

  it('returns a player account type without assuming admin', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json({ uid: 'user-1', accountType: 'player' });
      }),
    );

    const result = await syncCurrentUser();

    expect(result.accountType).toBe('player');
    expect(result.accountType).not.toBe('admin');
  });

  it('rejects a malformed account payload', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json({ ok: true });
      }),
    );

    await expect(syncCurrentUser()).rejects.toBeInstanceOf(ApiError);
  });
});
