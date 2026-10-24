import { describe, expect, it } from 'vitest';
import {
  catalogDataByType,
  emptyVersionSelections,
  selectByIndexOrId,
} from './catalogPageUtils';
import type { CatalogEntityData } from '../../types/catalog';

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
