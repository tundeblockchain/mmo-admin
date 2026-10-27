import { describe, expect, it } from 'vitest';
import { emptyDraftStore } from '../../hooks/draftStore';
import { createDefaultClass } from '../catalogDefaults';
import { buildCatalogBundle } from './exportBundle';

const vanguard = { ...createDefaultClass(), classId: 'vanguard' };

describe('buildCatalogBundle', () => {
  it('exports draft data when present and published data otherwise', () => {
    const drafts = emptyDraftStore();
    drafts.class = {
      catalogType: 'class',
      sourceVersion: 2,
      isDirty: true,
      wasRestored: false,
      data: [vanguard],
    };

    const bundle = buildCatalogBundle({
      versionTag: 'combat-0.1.0',
      source: 'draft',
      drafts,
      published: {
        status: [
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
    });

    expect(bundle.versionTag).toBe('combat-0.1.0');
    expect(bundle.class).toEqual([expect.objectContaining({ classId: 'vanguard' })]);
    expect(bundle.status).toEqual([expect.objectContaining({ statusId: 'burn' })]);
  });
});
