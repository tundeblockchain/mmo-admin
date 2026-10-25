import { describe, expect, it } from 'vitest';
import {
  catalogEntities,
  catalogReferenceEmptyMessage,
  catalogReferenceHref,
  mergeCatalogOptions,
  optionsWithCurrentValue,
} from './catalogOptions';
import type { ClassDefinition } from '../types/catalog';

function classEntity(classId: string, displayName: string): ClassDefinition {
  return {
    classId,
    displayName,
    description: '',
    primaryResource: 'resolve',
    startingStats: {
      strength: 1,
      finesse: 1,
      vitality: 1,
      intellect: 1,
      precision: 1,
      luck: 1,
      tech: 1,
      hp: 1,
      resourcePool: 1,
      armor: 1,
      attackPower: 1,
      spellPower: 1,
      movementSpeed: 1,
    },
    resonance: 'valor',
    roles: ['dps'],
  };
}

describe('mergeCatalogOptions', () => {
  it('returns an empty list when both sources are empty', () => {
    expect(mergeCatalogOptions('class', [], [])).toEqual([]);
  });

  it('uses published entities when there is no draft', () => {
    expect(
      mergeCatalogOptions('class', [classEntity('vanguard', 'Vanguard')], []),
    ).toEqual([{ id: 'vanguard', label: 'Vanguard' }]);
  });

  it('merges draft and published entities and dedupes by id', () => {
    const published = [
      classEntity('vanguard', 'Vanguard'),
      classEntity('ranger', 'Ranger'),
    ];
    const draft = [
      classEntity('vanguard', 'Vanguard Draft'),
      classEntity('warden', 'Warden'),
    ];

    expect(mergeCatalogOptions('class', published, draft)).toEqual([
      { id: 'vanguard', label: 'Vanguard Draft' },
      { id: 'warden', label: 'Warden' },
      { id: 'ranger', label: 'Ranger' },
    ]);
  });

  it('skips blank ids and falls back to the entity id when the name is empty', () => {
    expect(
      mergeCatalogOptions(
        'class',
        [classEntity('', 'Missing'), classEntity('shade', '')],
        [],
      ),
    ).toEqual([{ id: 'shade', label: 'shade' }]);
  });
});

describe('catalog option helpers', () => {
  it('returns array catalog entities and ignores non-list data', () => {
    expect(catalogEntities([classEntity('vanguard', 'Vanguard')])).toHaveLength(1);
    expect(catalogEntities(undefined)).toEqual([]);
  });

  it('appends the current value when it is missing from the options', () => {
    const options = [{ id: 'vanguard', label: 'Vanguard' }];
    expect(optionsWithCurrentValue(options, '')).toEqual(options);
    expect(optionsWithCurrentValue(options, 'vanguard')).toEqual(options);
    expect(optionsWithCurrentValue(options, 'legacy')).toEqual([
      ...options,
      { id: 'legacy', label: 'legacy' },
    ]);
  });

  it('builds the empty-state copy and catalog href', () => {
    expect(catalogReferenceEmptyMessage('class')).toBe('Add a class first.');
    expect(catalogReferenceEmptyMessage('element')).toBe('Add an element first.');
    expect(catalogReferenceHref('class')).toBe('/catalog/classes');
  });
});
