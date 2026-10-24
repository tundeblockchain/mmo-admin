import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { ApiError } from '../lib/errors';

vi.mock('../auth', () => ({
  getIdToken: vi.fn(),
}));

import { apiClient } from './client';
import { getIdToken } from '../auth';
import { forceRefreshCallCount } from '../test/clientAuthTestUtils';

describe('apiClient auth interceptors', () => {
  beforeEach(() => {
    vi.mocked(getIdToken).mockReset();
  });

  it('shares one in-flight forced refresh across concurrent 401s and retries each request once', async () => {
    let releaseRefresh!: (token: string) => void;
    const refreshGate = new Promise<string>((resolve) => {
      releaseRefresh = resolve;
    });

    vi.mocked(getIdToken).mockImplementation((forceRefresh?: boolean) => {
      if (forceRefresh === true) {
        return refreshGate;
      }
      return Promise.resolve('stale-token');
    });

    const attempts: Record<string, number> = { a: 0, b: 0 };
    const capturedAuthHeaders: Record<string, Array<string | null>> = { a: [], b: [] };

    server.use(
      http.get('*/auth-probe-a', ({ request }) => {
        attempts.a += 1;
        capturedAuthHeaders.a.push(request.headers.get('Authorization'));
        if (request.headers.get('Authorization') === 'Bearer stale-token') {
          return HttpResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({ ok: true, id: 'a' });
      }),
      http.get('*/auth-probe-b', ({ request }) => {
        attempts.b += 1;
        capturedAuthHeaders.b.push(request.headers.get('Authorization'));
        if (request.headers.get('Authorization') === 'Bearer stale-token') {
          return HttpResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({ ok: true, id: 'b' });
      }),
    );

    const pending = Promise.all([
      apiClient.get('/auth-probe-a'),
      apiClient.get('/auth-probe-b'),
    ]);

    await vi.waitFor(() => {
      expect(attempts.a).toBe(1);
      expect(attempts.b).toBe(1);
      expect(forceRefreshCallCount()).toBe(1);
    });

    releaseRefresh('fresh-token');

    const [responseA, responseB] = await pending;

    expect(responseA.data).toEqual({ ok: true, id: 'a' });
    expect(responseB.data).toEqual({ ok: true, id: 'b' });
    expect(attempts.a).toBe(2);
    expect(attempts.b).toBe(2);
    expect(capturedAuthHeaders.a).toEqual(['Bearer stale-token', 'Bearer fresh-token']);
    expect(capturedAuthHeaders.b).toEqual(['Bearer stale-token', 'Bearer fresh-token']);
    expect(forceRefreshCallCount()).toBe(1);
  });
  it('rejects all waiters when forced refresh fails and allows a later 401 to refresh again', async () => {
    let rejectRefresh!: (reason: Error) => void;
    let resolveRefresh!: (token: string) => void;
    let refreshGate = new Promise<string>((resolve, reject) => {
      resolveRefresh = resolve;
      rejectRefresh = reject;
    });

    vi.mocked(getIdToken).mockImplementation((forceRefresh?: boolean) => {
      if (forceRefresh === true) {
        return refreshGate;
      }
      return Promise.resolve('stale-token');
    });

    const attempts: Record<string, number> = { a: 0, b: 0, c: 0 };

    server.use(
      http.get('*/auth-probe-a', ({ request }) => {
        attempts.a += 1;
        if (request.headers.get('Authorization') === 'Bearer stale-token') {
          return HttpResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({ ok: true, id: 'a' });
      }),
      http.get('*/auth-probe-b', ({ request }) => {
        attempts.b += 1;
        if (request.headers.get('Authorization') === 'Bearer stale-token') {
          return HttpResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({ ok: true, id: 'b' });
      }),
      http.get('*/auth-probe-c', ({ request }) => {
        attempts.c += 1;
        if (request.headers.get('Authorization') === 'Bearer stale-token') {
          return HttpResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({ ok: true, id: 'c' });
      }),
    );

    const firstBatch = Promise.allSettled([
      apiClient.get('/auth-probe-a'),
      apiClient.get('/auth-probe-b'),
    ]);

    await vi.waitFor(() => {
      expect(attempts.a).toBe(1);
      expect(attempts.b).toBe(1);
      expect(forceRefreshCallCount()).toBe(1);
    });

    rejectRefresh(new Error('refresh failed'));

    const settled = await firstBatch;
    expect(settled).toHaveLength(2);
    for (const result of settled) {
      expect(result.status).toBe('rejected');
      if (result.status === 'rejected') {
        expect(result.reason).toBeInstanceOf(ApiError);
        expect((result.reason as ApiError).status).toBe(401);
      }
    }
    expect(attempts.a).toBe(1);
    expect(attempts.b).toBe(1);

    refreshGate = new Promise<string>((resolve) => {
      resolveRefresh = resolve;
    });

    const laterRequest = apiClient.get('/auth-probe-c');

    await vi.waitFor(() => {
      expect(attempts.c).toBe(1);
      expect(forceRefreshCallCount()).toBe(2);
    });

    resolveRefresh('fresh-token');

    const laterResponse = await laterRequest;
    expect(laterResponse.data).toEqual({ ok: true, id: 'c' });
    expect(attempts.c).toBe(2);
    expect(forceRefreshCallCount()).toBe(2);
  });
});
