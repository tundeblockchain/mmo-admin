import { describe, it, expect } from 'vitest';
import {
  getEntityId,
  getIdFieldLabel,
  getIdValidationMessage,
  draftHasInvalidIds,
} from './catalogIds';
import type { ClassDefinition, CombatConstantsData } from '../types/catalog';

const vanguard: ClassDefinition = {
  classId: 'vanguard',
  displayName: 'Vanguard',
  description: '',
  primaryResource: 'resolve',
  startingStats: {
    strength: 10,
    finesse: 10,
    vitality: 10,
    intellect: 10,
    precision: 10,
    luck: 10,
    tech: 10,
    hp: 100,
    resourcePool: 100,
    armor: 10,
    attackPower: 10,
    spellPower: 10,
    movementSpeed: 5,
  },
  resonance: 'valor',
  roles: ['dps'],
};

describe('catalogIds', () => {
  it('reads the id field for each catalog type', () => {
    expect(getEntityId({ classId: 'vanguard' }, 'class')).toBe('vanguard');
    expect(getEntityId({ skillId: 'cleave' }, 'skill')).toBe('cleave');
    expect(getEntityId({ statusId: 'flame' }, 'status')).toBe('flame');
    expect(getEntityId({ elementId: 'fire' }, 'element')).toBe('fire');
    expect(getEntityId({ resonanceId: 'valor' }, 'resonance')).toBe('valor');
    expect(getEntityId({}, 'combat-constants')).toBe('combat-constants');
  });

  it('returns field labels matching existing types', () => {
    expect(getIdFieldLabel('class')).toBe('Class ID');
    expect(getIdFieldLabel('skill')).toBe('Skill ID');
    expect(getIdFieldLabel('status')).toBe('Status ID');
    expect(getIdFieldLabel('element')).toBe('Element ID');
    expect(getIdFieldLabel('resonance')).toBe('Resonance ID');
  });

  it('rejects empty ids', () => {
    expect(getIdValidationMessage('', ['vanguard'])).toBe('ID is required');
    expect(getIdValidationMessage('   ', ['vanguard'])).toBe('ID is required');
  });

  it('rejects duplicate ids within the draft', () => {
    expect(getIdValidationMessage('vanguard', ['vanguard', 'vanguard'])).toBe(
      'ID must be unique within this draft',
    );
  });

  it('accepts unique non-empty ids', () => {
    expect(getIdValidationMessage('warden', ['vanguard', 'warden'])).toBeNull();
  });

  it('flags drafts that contain invalid ids', () => {
    expect(draftHasInvalidIds([{ ...vanguard, classId: '' }], 'class')).toBe(true);
    expect(
      draftHasInvalidIds(
        [vanguard, { ...vanguard, displayName: 'Copy' }],
        'class',
      ),
    ).toBe(true);
    expect(draftHasInvalidIds([vanguard], 'class')).toBe(false);
  });

  it('does not validate combat-constants as an entry list', () => {
    const data: CombatConstantsData = {
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

    expect(draftHasInvalidIds(data, 'combat-constants')).toBe(false);
  });
});
