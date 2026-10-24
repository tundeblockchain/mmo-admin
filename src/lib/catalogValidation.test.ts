import { describe, expect, it } from 'vitest';
import { createDefaultClass, createDefaultSkill, createDefaultStatus } from './catalogDefaults';
import {
  draftHasValidationErrors,
  getCombatConstantsFieldErrors,
  getResonanceFieldErrors,
  getSkillFieldErrors,
  getStatusFieldErrors,
} from './catalogValidation';
import { INTEGER_ERROR, REQUIRED_ERROR } from './catalogSchema';
import type { CombatConstantsData, ResonanceDefinition, SkillDefinition } from '../types/catalog';

const combatConstants: CombatConstantsData = {
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
};

describe('catalogValidation', () => {
  it('accepts seed-shaped skills, statuses, and combat constants', () => {
    expect(getSkillFieldErrors(createDefaultSkill())).toEqual({});
    expect(getStatusFieldErrors(createDefaultStatus())).toEqual({});
    expect(getCombatConstantsFieldErrors(combatConstants)).toEqual({});
    expect(draftHasValidationErrors([createDefaultClass()], 'class')).toBe(true);
    expect(draftHasValidationErrors([{ ...createDefaultClass(), classId: 'warden' }], 'class')).toBe(
      false,
    );
  });

  it('rejects empty resource effect ids and non-integer charges', () => {
    const skill: SkillDefinition = {
      ...createDefaultSkill(),
      charges: 1.5,
      resourceEffects: [{ resourceId: '', amount: 8, isPercentOfMax: false }],
    };

    const errors = getSkillFieldErrors(skill);
    expect(errors.charges).toBe(INTEGER_ERROR);
    expect(errors['resourceEffects.0.resourceId']).toBe(REQUIRED_ERROR);
  });

  it('rejects non-integer stat caps and empty party bonus stats', () => {
    const errors = getCombatConstantsFieldErrors({
      ...combatConstants,
      statCaps: { softCap: 100.5, hardCap: 150, softCapPenalty: 0.5 },
    });
    expect(errors['statCaps.softCap']).toBe(INTEGER_ERROR);

    const resonance: ResonanceDefinition = {
      resonanceId: 'valor',
      displayName: 'Valor',
      description: '',
      partyBonus: [{ stat: '', bonusPercent: 0.1 }],
    };
    expect(getResonanceFieldErrors(resonance)['partyBonus.0.stat']).toBe(REQUIRED_ERROR);
  });

  it('blocks publishing a draft that has field errors', () => {
    const skill: SkillDefinition = {
      ...createDefaultSkill(),
      skillId: 'vanguard_cleaving_strike',
      resourceEffects: [{ resourceId: '', amount: 1, isPercentOfMax: false }],
    };

    expect(draftHasValidationErrors([skill], 'skill')).toBe(true);
  });
});
