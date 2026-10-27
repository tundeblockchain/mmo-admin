import { describe, expect, it, vi } from 'vitest';
import type { CatalogType } from '../../types/catalog';
import { createDefaultClass } from '../catalogDefaults';
import { publishChangedCatalogs } from './publishChanged';

const vanguard = { ...createDefaultClass(), classId: 'vanguard' };

describe('publishChangedCatalogs failures', () => {
  it('keeps earlier published types when a later POST fails', async () => {
    const publish = vi.fn(async (catalogType: CatalogType) => {
      if (catalogType === 'skill') {
        throw new Error('skill publish failed');
      }
      return {
        catalogType,
        version: 3,
        status: 'published' as const,
        createdAt: '2024-06-20T00:00:00.000Z',
        publishedAt: '2024-06-20T00:00:00.000Z',
        createdBy: 'test-user',
      };
    });

    const results = await publishChangedCatalogs(
      [
        { catalogType: 'class', data: [vanguard] },
        {
          catalogType: 'skill',
          data: [
            {
              skillId: 'vanguard_cleaving_strike',
              classId: 'vanguard',
              displayName: 'Cleaving Strike',
              description: '',
              kind: 'active',
              resourceId: null,
              resourceCost: 0,
              cooldownSeconds: 0,
              charges: 1,
              chargeRechargeSeconds: 0,
              castTimeSeconds: 0,
              castableWhileMoving: false,
              range: 0,
              coefficients: { basePower: 1.5, scaling: [] },
              unlockLevel: 1,
              iconPath: '',
            },
          ],
        },
        {
          catalogType: 'status',
          data: [
            {
              statusId: 'burn',
              displayName: 'Burn',
              description: '',
              category: 'dot',
              maxStacks: 1,
              dispellable: true,
              persistsThroughDeath: false,
              iconPath: '',
            },
          ],
        },
      ],
      publish,
    );

    expect(results).toEqual([
      { catalogType: 'class', status: 'published', version: 3 },
      { catalogType: 'skill', status: 'failed', message: 'skill publish failed' },
      { catalogType: 'status', status: 'published', version: 3 },
    ]);
    expect(publish).toHaveBeenCalledTimes(3);
  });
});
