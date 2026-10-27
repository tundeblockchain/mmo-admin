import { describe, expect, it } from 'vitest';
import {
  catalogDataByType,
  emptyVersionSelections,
  resolveVersionSelections,
  selectByIndexOrId,
} from './catalogPageUtils';
import type { CatalogEntityData, CatalogVersionSummary, LatestVersions } from '../../types/catalog';

const items = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' },
];

describe('selectByIndexOrId', () => {
  it('returns null when the list is missing', () => {
    expect(selectByIndexOrId(undefined as typeof items | undefined, 0, 'a', (item) => item.id)).toBeNull();
  });

  it('prefers the selected index when it is set', () => {
    expect(selectByIndexOrId(items, 1, 'a', (item) => item.id)).toEqual(items[1]);
  });

  it('falls back to id lookup when no index is selected', () => {
    expect(selectByIndexOrId(items, null, 'b', (item) => item.id)).toEqual(items[1]);
  });
});

describe('catalogDataByType', () => {
  it('returns the matching catalog payload', () => {
    const data = {
      class: [{ classId: 'vanguard' }] as unknown as CatalogEntityData,
      skill: undefined,
      status: undefined,
      element: undefined,
      resonance: undefined,
      'combat-constants': undefined,
    };

    expect(catalogDataByType('class', data)).toEqual([{ classId: 'vanguard' }]);
    expect(catalogDataByType('skill', data)).toBeUndefined();
  });
});

describe('emptyVersionSelections', () => {
  it('starts every catalog type unselected', () => {
    expect(emptyVersionSelections()).toEqual({
      class: null,
      skill: null,
      'combat-constants': null,
      status: null,
      element: null,
      resonance: null,
    });
  });
});

describe('resolveVersionSelections', () => {
  const versions: CatalogVersionSummary[] = [
    { catalogType: 'class', version: 2, status: 'published', publishedAt: '2024-06-15T10:30:00.000Z' },
    { catalogType: 'skill', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
  ];
  const latest: LatestVersions = {
    versions: { class: 2, skill: 1, status: 4 },
    timestamp: '',
  };

  it('defaults each type to latest and keeps overrides', () => {
    const overrides = { ...emptyVersionSelections(), class: 1 };

    expect(resolveVersionSelections(overrides, versions, latest)).toEqual({
      class: 1,
      skill: 1,
      'combat-constants': null,
      status: 4,
      element: null,
      resonance: null,
    });
  });
});
