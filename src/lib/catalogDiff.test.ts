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

  it('counts nested skill and combat-constant edits as modified', () => {
    const skill = {
      skillId: 'vanguard_cleaving_strike',
      classId: 'vanguard',
      displayName: 'Cleaving Strike',
      description: '',
      kind: 'active' as const,
      resourceId: null,
      resourceCost: 0,
      resourceEffects: [{ resourceId: 'resolve', amount: 8, isPercentOfMax: false }],
      cooldownSeconds: 0,
      charges: 1,
      chargeRechargeSeconds: 0,
      castTimeSeconds: 0,
      castableWhileMoving: false,
      range: 0,
      coefficients: {
        basePower: 1.5,
        scaling: [{ stat: 'attackPower' as const, coefficient: 1.5 }],
        perStack: { basePowerPerStack: [1.5, 2] },
      },
      unlockLevel: 1,
      iconPath: 'icons/skills/vanguard/cleaving_strike.png',
    };

    const editedSkill = {
      ...skill,
      resourceEffects: [{ resourceId: 'resolve', amount: 12, isPercentOfMax: false }],
      coefficients: {
        ...skill.coefficients,
        perStack: { basePowerPerStack: [1.5, 2.2] },
      },
    };

    expect(computeDiffSummary([skill], [editedSkill], 'skill').modified).toBe(1);

    const constants = {
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
      statCaps: { softCap: 100, hardCap: 150, softCapPenalty: 0.5 },
      dodge: { baseDodgeChance: 0.02, maxDodgeChance: 0.4 },
    };

    expect(
      computeDiffSummary(
        constants,
        { ...constants, dodge: { ...constants.dodge, maxDodgeChance: 0.45 } },
        'combat-constants',
      ).modified,
    ).toBe(1);
  });

  it('counts modified entries separately from added and removed', () => {
    const modified = { ...vanguard, displayName: 'Modified Vanguard' };
    const summary = computeDiffSummary([vanguard, ranger], [modified], 'class');

    expect(summary.added).toBe(0);
    expect(summary.removed).toBe(1);
    expect(summary.modified).toBe(1);
  });
});
