import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { publishCatalog } from './catalog';
import { mockClassCatalog, mockCombatConstantsCatalog } from '../test/mocks/catalog-fixtures';

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

  it('publishes catalog with JWT authorization header', async () => {
    let capturedAuthHeader: string | null = null;

    server.use(
      http.post('*/catalog/class/versions', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization');
        return HttpResponse.json(
          {
            catalogType: 'class',
            version: 3,
            status: 'published',
            createdAt: '2024-06-16T08:00:00.000Z',
            publishedAt: '2024-06-16T08:00:00.000Z',
            createdBy: 'test-user-uid',
          },
          { status: 201 },
        );
      }),
    );

    await publishCatalog('class', { data: mockClassData, releaseNotes: 'Test' });

    expect(capturedAuthHeader).toBe('Bearer mock-firebase-id-token');
  });
  it('returns published version response', async () => {
    const result = await publishCatalog('class', {
      data: mockClassData,
      releaseNotes: 'Test release',
    });

    expect(result.catalogType).toBe('class');
    expect(result.version).toBeGreaterThanOrEqual(1);
    expect(result.status).toBe('published');
    expect(result.createdBy).toBeTruthy();
  });
  it('includes release notes in request', async () => {
    let capturedReleaseNotes: string | undefined;

    server.use(
      http.post('*/catalog/class/versions', async ({ request }) => {
        const body = (await request.json()) as { data: unknown; releaseNotes?: string };
        capturedReleaseNotes = body.releaseNotes;
        return HttpResponse.json(
          {
            catalogType: 'class',
            version: 3,
            status: 'published',
            createdAt: '2024-06-16T08:00:00.000Z',
            publishedAt: '2024-06-16T08:00:00.000Z',
            createdBy: 'test-user-uid',
            releaseNotes: capturedReleaseNotes,
          },
          { status: 201 },
        );
      }),
    );

    await publishCatalog('class', {
      data: mockClassData,
      releaseNotes: 'Test release notes',
    });

    expect(capturedReleaseNotes).toBe('Test release notes');
  });
  it('sends data as decimals not percentages', async () => {
    interface CapturedCombatConstants {
      critical: {
        baseCritChance: number;
        criticalDamageMultiplier: number;
      };
      defense: {
        maxArmorReduction: number;
      };
    }
    let capturedData: CapturedCombatConstants | null = null;

    server.use(
      http.post('*/catalog/combat-constants/versions', async ({ request }) => {
        const body = (await request.json()) as { data: CapturedCombatConstants };
        capturedData = body.data;
        return HttpResponse.json(
          {
            catalogType: 'combat-constants',
            version: 2,
            status: 'published',
            createdAt: '2024-06-16T08:00:00.000Z',
            publishedAt: '2024-06-16T08:00:00.000Z',
            createdBy: 'test-user-uid',
          },
          { status: 201 },
        );
      }),
    );

    await publishCatalog('combat-constants', { data: mockCombatConstantsCatalog.data });

    expect(capturedData).not.toBeNull();
    expect(capturedData!.critical.baseCritChance).toBe(0.05);
    expect(capturedData!.critical.criticalDamageMultiplier).toBe(1.5);
    expect(capturedData!.defense.maxArmorReduction).toBe(0.75);
  });
  it('never sends PATCH requests', async () => {
    let patchCalled = false;

    server.use(
      http.patch('*/catalog/*', () => {
        patchCalled = true;
        return HttpResponse.json({ error: 'PATCH not allowed' }, { status: 405 });
      }),
    );

    await publishCatalog('class', { data: mockClassData });

    expect(patchCalled).toBe(false);
  });
});
