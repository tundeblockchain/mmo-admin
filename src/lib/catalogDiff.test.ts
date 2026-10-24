import { describe, it, expect } from 'vitest';
import { computeDiffSummary } from './catalogDiff';
import type { ClassDefinition } from '../types/catalog';

const vanguard: ClassDefinition = {
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
    movementSpeed: 5,
  },
  resonance: 'valor',
  roles: ['tank', 'dps'],
};

const ranger: ClassDefinition = {
  ...vanguard,
  classId: 'ranger',
  displayName: 'Ranger',
  primaryResource: 'focus',
  resonance: 'precision',
  roles: ['dps'],
};

describe('computeDiffSummary', () => {
  it('counts added and removed entries against the pinned source', () => {
    const summary = computeDiffSummary([vanguard, ranger], [vanguard], 'class');

    expect(summary).toEqual({
      added: 0,
      modified: 0,
      removed: 1,
      unchanged: 1,
    });
  });

  it('counts a newly added entry', () => {
    const warden: ClassDefinition = {
      ...vanguard,
      classId: 'warden',
      displayName: 'Warden',
    };

    const summary = computeDiffSummary([vanguard], [vanguard, warden], 'class');

    expect(summary.added).toBe(1);
    expect(summary.removed).toBe(0);
    expect(summary.modified).toBe(0);
    expect(summary.unchanged).toBe(1);
  });

  it('counts modified entries separately from added and removed', () => {
    const modified = { ...vanguard, displayName: 'Modified Vanguard' };
    const summary = computeDiffSummary([vanguard, ranger], [modified], 'class');

    expect(summary.added).toBe(0);
    expect(summary.removed).toBe(1);
    expect(summary.modified).toBe(1);
  });
});
