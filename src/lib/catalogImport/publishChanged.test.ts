import { describe, expect, it, vi } from 'vitest';
import type { CatalogType } from '../../types/catalog';
import { EMPTY_LIST_PUBLISH_MESSAGE } from '../catalogSchema';
import { createDefaultClass } from '../catalogDefaults';
import { dirtyDraftsToPublish, publishChangedCatalogs } from './publishChanged';

const vanguard = { ...createDefaultClass(), classId: 'vanguard' };

describe('publishChangedCatalogs', () => {
  it('publishes each type and skips empty list arrays', async () => {
    const publish = vi.fn(async (catalogType: CatalogType) => {
      return {
        catalogType,
        version: catalogType === 'class' ? 3 : 2,
        status: 'published' as const,
        createdAt: '2024-06-20T00:00:00.000Z',
        publishedAt: '2024-06-20T00:00:00.000Z',
        createdBy: 'test-user',
      };
    });

    const results = await publishChangedCatalogs(
      [
        { catalogType: 'class', data: [vanguard] },
        { catalogType: 'skill', data: [] },
        {
          catalogType: 'element',
          data: [
            {
              elementId: 'fire',
              displayName: 'Fire',
              color: '#FF4500',
              strongAgainst: {},
              weakAgainst: {},
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
      { catalogType: 'skill', status: 'skipped', message: EMPTY_LIST_PUBLISH_MESSAGE },
      { catalogType: 'element', status: 'published', version: 2 },
      { catalogType: 'status', status: 'published', version: 2 },
    ]);
    expect(publish).toHaveBeenCalledTimes(3);
  });

  it('skips empty list arrays instead of posting them', async () => {
    const publish = vi.fn();
    const results = await publishChangedCatalogs([{ catalogType: 'class', data: [] }], publish);
    expect(publish).not.toHaveBeenCalled();
    expect(results[0]).toEqual({
      catalogType: 'class',
      status: 'skipped',
      message: EMPTY_LIST_PUBLISH_MESSAGE,
    });
  });

  it('collects dirty drafts only', () => {
    expect(
      dirtyDraftsToPublish({
        class: { isDirty: true, data: [vanguard] },
        skill: { isDirty: false, data: [] },
        status: null,
      }),
    ).toEqual([{ catalogType: 'class', data: [vanguard] }]);
  });
});
