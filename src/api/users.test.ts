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
    let capturedMethod: string | null = null;

    server.use(
      http.post('*/users/me', ({ request }) => {
        capturedMethod = request.method;
        capturedAuthHeader = request.headers.get('Authorization');
        return HttpResponse.json({ uid: 'user-1', accountType: 'admin' });
      }),
    );

    const result = await syncCurrentUser();

    expect(capturedMethod).toBe('POST');
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

  it('surfaces network and 5xx failures as ApiError', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json({ error: 'Catalog unavailable' }, { status: 503 });
      }),
    );

    try {
      await syncCurrentUser();
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(503);
    }
  });

  it('rejects a malformed account payload', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json({ ok: true });
      }),
    );

    try {
      await syncCurrentUser();
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe('Invalid account response');
    }
  });
});
