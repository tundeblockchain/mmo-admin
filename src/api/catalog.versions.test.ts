import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { fetchCatalogVersions, fetchLatestCatalogVersions } from './catalog';

vi.mock('../auth', () => ({
  getIdToken: vi.fn(),
}));

import { getIdToken } from '../auth';

describe('catalog version reads', () => {
  beforeEach(() => {
    vi.mocked(getIdToken).mockResolvedValue('mock-firebase-id-token');
  });

  it('treats an empty versions array as no published catalogs', async () => {
    server.use(http.get('*/catalog/versions', () => HttpResponse.json([])));

    await expect(fetchCatalogVersions()).resolves.toEqual({ versions: [] });
  });

  it('treats a missing latest map as empty rather than an error', async () => {
    server.use(
      http.get('*/catalog/versions/latest', () => HttpResponse.json({ versions: {} })),
    );

    await expect(fetchLatestCatalogVersions()).resolves.toEqual({
      versions: {},
      timestamp: '',
    });
  });
});
