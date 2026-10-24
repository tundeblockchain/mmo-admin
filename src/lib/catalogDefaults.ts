import type {
  ClassDefinition,
  SkillDefinition,
  StatusDefinition,
  ElementDefinition,
  ResonanceDefinition,
} from '../types/catalog';

export function createDefaultClass(): ClassDefinition {
  return {
    classId: '',
    displayName: 'New Class',
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
      movementSpeed: 5.0,
    },
    resonance: 'valor',
    roles: ['dps'],
  };
}

export function createDefaultSkill(): SkillDefinition {
  return {
    skillId: '',
    classId: 'vanguard',
    displayName: 'New Skill',
    description: '',
    kind: 'active',
    resourceId: null,
    resourceCost: 0,
    cooldownSeconds: 0,
    charges: 1,
    chargeRechargeSeconds: 0,
    castTimeSeconds: 0,
    castableWhileMoving: false,
    range: 0,
    coefficients: {
      basePower: 1.5,
      scaling: [{ stat: 'attackPower', coefficient: 1.5 }],
      element: 'physical',
    },
    timing: { castMs: 0, activeMs: 350, recoveryMs: 300 },
    stagger: { staggerPower: 20, canStagger: true },
    unlockLevel: 1,
    iconPath: '',
  };
}

export function createDefaultStatus(): StatusDefinition {
  return {
    statusId: '',
    displayName: 'New Status',
    description: '',
    category: 'buff',
    maxStacks: 1,
    dispellable: true,
    persistsThroughDeath: false,
    iconPath: '',
  };
}

export function createDefaultElement(): ElementDefinition {
  return {
    elementId: '',
    displayName: 'New Element',
    color: '#808080',
    strongAgainst: {},
    weakAgainst: {},
  };
}

export function createDefaultResonance(): ResonanceDefinition {
  return {
    resonanceId: '',
    displayName: 'New Resonance',
    description: '',
    partyBonus: [{ stat: 'hp', bonusPercent: 0.1 }],
  };
}
