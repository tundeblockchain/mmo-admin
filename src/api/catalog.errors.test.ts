import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { publishCatalog } from './catalog';
import { AdminForbiddenError, ApiError } from '../lib/errors';
import { mockClassCatalog } from '../test/mocks/catalog-fixtures';

vi.mock('../auth', () => ({
  getIdToken: vi.fn(),
}));

import { getIdToken } from '../auth';

const mockClassData = mockClassCatalog.data;

describe('publishCatalog', () => {
  beforeEach(() => {
    vi.mocked(getIdToken).mockResolvedValue('mock-firebase-id-token');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('surfaces 401 when not authenticated', async () => {
    vi.mocked(getIdToken).mockResolvedValue(null);

    try {
      await publishCatalog('class', { data: mockClassData });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(401);
    }
  });
  it('handles 401 unauthenticated error', async () => {
    server.use(
      http.post('*/catalog/class/versions', () => {
        return HttpResponse.json(
          { error: 'Valid Firebase ID token required' },
          { status: 401 },
        );
      }),
    );

    try {
      await publishCatalog('class', { data: mockClassData });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(401);
    }
  });
  it('surfaces 403 as AdminForbiddenError without a generic fallback', async () => {
    server.use(
      http.post('*/catalog/class/versions', () => {
        return HttpResponse.json({ error: 'Admin only' }, { status: 403 });
      }),
    );

    try {
      await publishCatalog('class', { data: mockClassData });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(AdminForbiddenError);
      expect((error as AdminForbiddenError).status).toBe(403);
      expect((error as AdminForbiddenError).message).toBe('Admin only');
    }

    expect(getIdToken).not.toHaveBeenCalledWith(true);
  });
  it('surfaces 400 when the server rejects the catalog payload', async () => {
    server.use(
      http.post('*/catalog/class/versions', () => {
        return HttpResponse.json(
          { error: 'Catalog data must not be an empty array' },
          { status: 400 },
        );
      }),
    );

    try {
      await publishCatalog('class', { data: [] });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).not.toBeInstanceOf(AdminForbiddenError);
      expect((error as ApiError).status).toBe(400);
      expect((error as ApiError).message).toBe('Catalog data must not be an empty array');
    }

    expect(getIdToken).not.toHaveBeenCalledWith(true);
  });
  it('handles 409 version conflict error', async () => {
    server.use(
      http.post('*/catalog/class/versions', () => {
        return HttpResponse.json(
          { error: 'Version 3 already exists for class. Retry to allocate a new version.' },
          { status: 409 },
        );
      }),
    );

    try {
      await publishCatalog('class', { data: mockClassData });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(409);
    }
  });
});
