import { describe, it, expect } from 'vitest';
import {
  createDefaultClass,
  createDefaultCombatConstants,
  createDefaultSkill,
  createDefaultStatus,
  createDefaultElement,
  createDefaultResonance,
} from './catalogDefaults';

describe('catalogDefaults', () => {
  it('creates a class with empty classId and startingStats', () => {
    const entry = createDefaultClass();

    expect(entry.classId).toBe('');
    expect(entry.displayName).toBe('New Class');
    expect(entry.startingStats).toEqual({
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
      movementSpeed: 5.0,
    });
    expect(entry.primaryResource).toBe('resolve');
    expect(entry.resonance).toBe('valor');
    expect(entry.roles).toEqual(['dps']);
  });

  it('creates a skill with seed-shaped coefficients as decimals', () => {
    const entry = createDefaultSkill();

    expect(entry.skillId).toBe('');
    expect(entry.displayName).toBe('New Skill');
    expect(entry.classId).toBe('');
    expect(entry.kind).toBe('active');
    expect(entry.coefficients.basePower).toBe(1.5);
    expect(entry.coefficients.scaling).toEqual([
      { stat: 'attackPower', coefficient: 1.5 },
    ]);
    expect(entry.coefficients.element).toBe('physical');
    expect(entry.timing).toEqual({ castMs: 0, activeMs: 350, recoveryMs: 300 });
    expect(entry.resourceId).toBeNull();
    expect(entry.iconPath).toBe('');
  });

  it('creates a status with required seed fields', () => {
    const entry = createDefaultStatus();

    expect(entry.statusId).toBe('');
    expect(entry.displayName).toBe('New Status');
    expect(entry.category).toBe('buff');
    expect(entry.maxStacks).toBe(1);
    expect(entry.dispellable).toBe(true);
    expect(entry.persistsThroughDeath).toBe(false);
    expect(entry.iconPath).toBe('');
  });

  it('creates an element with empty maps and decimal-ready multipliers', () => {
    const entry = createDefaultElement();

    expect(entry.elementId).toBe('');
    expect(entry.displayName).toBe('New Element');
    expect(entry.color).toBe('#808080');
    expect(entry.strongAgainst).toEqual({});
    expect(entry.weakAgainst).toEqual({});
  });

  it('creates a resonance with decimal party bonus percent', () => {
    const entry = createDefaultResonance();

    expect(entry.resonanceId).toBe('');
    expect(entry.displayName).toBe('New Resonance');
    expect(entry.partyBonus).toEqual([{ stat: 'hp', bonusPercent: 0.1 }]);
  });

  it('creates combat constants with required seed fields', () => {
    const entry = createDefaultCombatConstants();

    expect(entry.powerScaling.physicalPower.strengthMultiplier).toBe(2);
    expect(entry.critical.baseCritChance).toBe(0.05);
    expect(entry.defense.maxArmorReduction).toBe(0.75);
  });
});
