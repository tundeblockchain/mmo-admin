import { describe, expect, it } from 'vitest';
import { mockClassCatalog, mockCombatConstantsCatalog, mockSkillCatalog } from '../test/mocks/catalog-fixtures';
import {
  draftListLength,
  mergeCatalogSource,
  mergeDraftAndPublished,
  publishedListSource,
} from './catalogSnapshots';

describe('publishedListSource', () => {
  it('waits until latest versions have loaded', () => {
    expect(publishedListSource(false, 1, { isPending: false, isError: false, data: mockSkillCatalog })).toEqual({
      entries: undefined,
      ready: false,
    });
  });

  it('treats a missing published version as an empty ready list', () => {
    expect(publishedListSource(true, null, { isPending: true, isError: false })).toEqual({
      entries: [],
      ready: true,
    });
  });

  it('waits for an in-flight or failed catalog query', () => {
    expect(publishedListSource(true, 1, { isPending: true, isError: false })).toEqual({
      entries: undefined,
      ready: false,
    });
    expect(publishedListSource(true, 1, { isPending: false, isError: true })).toEqual({
      entries: undefined,
      ready: false,
    });
  });

  it('returns published entries once the query succeeds', () => {
    expect(publishedListSource(true, 1, { isPending: false, isError: false, data: mockSkillCatalog })).toEqual({
      entries: mockSkillCatalog.data,
      ready: true,
    });
  });
});

describe('mergeCatalogSource', () => {
  it('prefers a draft array over published entries', () => {
    expect(
      mergeCatalogSource(mockClassCatalog.data, {
        entries: [],
        ready: false,
      }),
    ).toEqual({ entries: mockClassCatalog.data, ready: true });
  });

  it('falls back to the published source when no draft exists', () => {
    expect(
      mergeCatalogSource(undefined, { entries: mockSkillCatalog.data, ready: true }),
    ).toEqual({ entries: mockSkillCatalog.data, ready: true });
  });
});

describe('mergeDraftAndPublished', () => {
  it('uses draft data for types that have a working copy', () => {
    const merged = mergeDraftAndPublished(
      { skill: { data: [] } },
      {
        class: { entries: mockClassCatalog.data, ready: true },
        skill: { entries: mockSkillCatalog.data, ready: true },
        status: { entries: [], ready: true },
        element: { entries: [], ready: true },
        resonance: { entries: [], ready: true },
      },
    );

    expect(merged.snapshot.skill).toEqual([]);
    expect(merged.ready.skill).toBe(true);
    expect(merged.snapshot.class).toEqual(mockClassCatalog.data);
  });
});

describe('draftListLength', () => {
  it('counts array drafts and treats objects as empty', () => {
    expect(draftListLength(mockClassCatalog.data)).toBe(2);
    expect(draftListLength(mockCombatConstantsCatalog.data)).toBe(0);
    expect(draftListLength(undefined)).toBe(0);
  });
});
