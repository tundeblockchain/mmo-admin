import { describe, expect, it } from 'vitest';
import { mockClassCatalog, mockSkillCatalog } from '../test/mocks/catalog-fixtures';
import {
  findCatalogDependents,
  isSnapshotReadyFor,
  type CatalogEntriesSnapshot,
  type CatalogReadiness,
} from './catalogDependents';
import type { ElementDefinition, SkillDefinition } from '../types/catalog';

const ready: CatalogReadiness = {
  class: true,
  skill: true,
  status: true,
  element: true,
  resonance: true,
};

const snapshot: CatalogEntriesSnapshot = {
  class: mockClassCatalog.data,
  skill: mockSkillCatalog.data,
};

function skillWith(overrides: Partial<SkillDefinition>): SkillDefinition {
  return { ...mockSkillCatalog.data[0], ...overrides };
}

describe('findCatalogDependents', () => {
  it('finds skills that reference a class', () => {
    expect(findCatalogDependents('class', 'vanguard', snapshot)).toEqual([
      {
        catalogType: 'skill',
        id: 'vanguard_cleaving_strike',
        displayName: 'Cleaving Strike',
      },
    ]);
    expect(findCatalogDependents('class', 'ranger', snapshot)).toEqual([]);
  });

  it('finds skills that apply a status or build it up', () => {
    const withStatus: CatalogEntriesSnapshot = {
      skill: [
        skillWith({
          skillId: 'ignite',
          displayName: 'Ignite',
          coefficients: {
            ...mockSkillCatalog.data[0].coefficients,
            appliesStatus: 'flame',
          },
        }),
        skillWith({
          skillId: 'sear',
          displayName: 'Sear',
          coefficients: mockSkillCatalog.data[0].coefficients,
          stagger: { staggerPower: 5, canStagger: true, statusBuildup: { status: 'flame', value: 1 } },
        }),
      ],
    };

    expect(findCatalogDependents('status', 'flame', withStatus)).toEqual([
      { catalogType: 'skill', id: 'ignite', displayName: 'Ignite' },
      { catalogType: 'skill', id: 'sear', displayName: 'Sear' },
    ]);
  });

  it('finds skills and other elements that reference an element', () => {
    const ice: ElementDefinition = {
      elementId: 'ice',
      displayName: 'Ice',
      color: '#88c',
      strongAgainst: { fire: 1.25 },
      weakAgainst: { physical: 0.8 },
    };
    const withElement: CatalogEntriesSnapshot = {
      skill: [
        skillWith({
          coefficients: { ...mockSkillCatalog.data[0].coefficients, element: 'fire' },
        }),
      ],
      element: [ice],
    };

    expect(findCatalogDependents('element', 'fire', withElement)).toEqual([
      {
        catalogType: 'skill',
        id: 'vanguard_cleaving_strike',
        displayName: 'Cleaving Strike',
      },
      { catalogType: 'element', id: 'ice', displayName: 'Ice' },
    ]);
  });

  it('ignores an element referencing itself', () => {
    const fire: ElementDefinition = {
      elementId: 'fire',
      displayName: 'Fire',
      color: '#f40',
      strongAgainst: {},
      weakAgainst: { fire: 0.5 },
    };

    expect(findCatalogDependents('element', 'fire', { element: [fire] })).toEqual([]);
  });

  it('finds classes that use a resonance', () => {
    expect(findCatalogDependents('resonance', 'valor', snapshot)).toEqual([
      { catalogType: 'class', id: 'vanguard', displayName: 'Vanguard' },
    ]);
  });

  it('returns no dependents for skills', () => {
    expect(findCatalogDependents('skill', 'vanguard_cleaving_strike', snapshot)).toEqual([]);
  });
});

describe('isSnapshotReadyFor', () => {
  it('requires only the catalogs that can reference the target', () => {
    expect(isSnapshotReadyFor('class', { ...ready, skill: false })).toBe(false);
    expect(isSnapshotReadyFor('skill', { ...ready, skill: false })).toBe(true);
    expect(isSnapshotReadyFor('element', { ...ready, element: false })).toBe(false);
    expect(isSnapshotReadyFor('resonance', ready)).toBe(true);
  });
});
