import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { publishCatalog } from './catalog';
import { ApiError } from '../lib/errors';
import type { ClassDefinition } from '../types/catalog';

vi.mock('../auth', () => ({
  getIdToken: vi.fn(),
}));

import { getIdToken } from '../auth';

const mockClassData: ClassDefinition[] = [
  {
    classId: 'vanguard',
    displayName: 'Vanguard',
    description: 'A stalwart frontline defender.',
    primaryResource: 'resolve',
    startingStats: {
      strength: 12,
      finesse: 7,
      vitality: 12,
      intellect: 4,
      precision: 6,
      luck: 5,
      tech: 4,
      hp: 150,
      resourcePool: 100,
      armor: 20,
      attackPower: 26,
      spellPower: 9,
      movementSpeed: 5.0,
    },
    resonance: 'valor',
    roles: ['tank', 'dps'],
  },
];

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

  it('throws error when not authenticated', async () => {
    vi.mocked(getIdToken).mockResolvedValue(null);

    await expect(
      publishCatalog('class', { data: mockClassData }),
    ).rejects.toThrow('Authentication required to publish catalog');
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

    const combatConstants = {
      powerScaling: {
        physicalPower: { strengthMultiplier: 2, levelMultiplier: 1.5 },
        spellPower: { intellectMultiplier: 2, levelMultiplier: 1 },
        techPower: { techMultiplier: 2, levelMultiplier: 1 },
        devicePower: { techDivisor: 100 },
      },
      critical: {
        baseCritChance: 0.05,
        critChance: { luckConstant: 500, maxLuckCritBonus: 0.3 },
        procChance: { luckDivisor: 500 },
        criticalDamageMultiplier: 1.5,
      },
      defense: {
        defenseConstant: { baseConstant: 200, levelMultiplier: 15 },
        armorReductionPerPoint: 0.001,
        maxArmorReduction: 0.75,
        blockDamageReduction: 0.5,
      },
    };

    await publishCatalog('combat-constants', { data: combatConstants });

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
