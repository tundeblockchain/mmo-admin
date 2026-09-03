import { http, HttpResponse } from 'msw';
import type {
  CatalogVersionList,
  LatestVersions,
  ClassCatalogData,
  SkillCatalogData,
  StatusCatalogData,
  ElementCatalogData,
  ResonanceCatalogData,
  CombatConstantsCatalogData,
} from '../../types/catalog';

export const mockVersionList: CatalogVersionList = {
  versions: [
    { catalogType: 'class', version: 2, status: 'published', publishedAt: '2024-06-15T10:30:00.000Z' },
    { catalogType: 'class', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
    { catalogType: 'skill', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
    { catalogType: 'combat-constants', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
    { catalogType: 'status', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
    { catalogType: 'element', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
    { catalogType: 'resonance', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
  ],
};

export const mockLatestVersions: LatestVersions = {
  versions: {
    class: 2,
    skill: 1,
    'combat-constants': 1,
    status: 1,
    element: 1,
    resonance: 1,
  },
  timestamp: '2024-06-15T10:30:00.000Z',
};

export const mockClassCatalog: ClassCatalogData = {
  catalogType: 'class',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  publishedAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'test-user',
  data: [
    {
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
        movementSpeed: 5.0,
      },
      resonance: 'valor',
      roles: ['tank', 'dps'],
    },
    {
      classId: 'ranger',
      displayName: 'Ranger',
      description: 'A precise marksman.',
      primaryResource: 'focus',
      startingStats: {
        strength: 6,
        finesse: 11,
        vitality: 6,
        intellect: 4,
        precision: 13,
        luck: 7,
        tech: 3,
        hp: 100,
        resourcePool: 100,
        armor: 8,
        attackPower: 14,
        spellPower: 9,
        movementSpeed: 5.5,
      },
      resonance: 'precision',
      roles: ['dps'],
    },
  ],
};

export const mockSkillCatalog: SkillCatalogData = {
  catalogType: 'skill',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'test-user',
  data: [
    {
      skillId: 'vanguard_cleaving_strike',
      classId: 'vanguard',
      displayName: 'Cleaving Strike',
      description: '1.50 P + 0.60 STR, 120° arc.',
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
        scaling: [
          { stat: 'attackPower', coefficient: 1.5 },
          { stat: 'strength', coefficient: 0.6 },
        ],
        element: 'physical',
      },
      timing: { castMs: 0, activeMs: 350, recoveryMs: 300 },
      stagger: { staggerPower: 20, canStagger: true },
      unlockLevel: 1,
      iconPath: 'icons/skills/vanguard/cleaving_strike.png',
    },
  ],
};

export const mockStatusCatalog: StatusCatalogData = {
  catalogType: 'status',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'test-user',
  data: [
    {
      statusId: 'flame',
      displayName: 'Flame',
      description: 'Burning from fire damage.',
      category: 'dot',
      maxStacks: 3,
      dispellable: true,
      persistsThroughDeath: false,
      iconPath: 'icons/statuses/flame.png',
    },
  ],
};

export const mockElementCatalog: ElementCatalogData = {
  catalogType: 'element',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'test-user',
  data: [
    {
      elementId: 'fire',
      displayName: 'Fire',
      color: '#FF4500',
      strongAgainst: { ice: 1.25, nature: 1.25 },
      weakAgainst: { fire: 0.5 },
    },
  ],
};

export const mockResonanceCatalog: ResonanceCatalogData = {
  catalogType: 'resonance',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'test-user',
  data: [
    {
      resonanceId: 'valor',
      displayName: 'Valor',
      description: 'The resonance of the Vanguard.',
      partyBonus: [
        { stat: 'hp', bonusPercent: 0.1 },
        { stat: 'armor', bonusPercent: 0.08 },
      ],
    },
  ],
};

export const mockCombatConstantsCatalog: CombatConstantsCatalogData = {
  catalogType: 'combat-constants',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'test-user',
  data: {
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
  },
};

export const catalogHandlers = [
  http.get('*/catalog/versions', () => {
    return HttpResponse.json(mockVersionList);
  }),

  http.get('*/catalog/versions/latest', () => {
    return HttpResponse.json(mockLatestVersions);
  }),

  http.get('*/catalog/class/v/:version', () => {
    return HttpResponse.json(mockClassCatalog);
  }),

  http.get('*/catalog/skill/v/:version', () => {
    return HttpResponse.json(mockSkillCatalog);
  }),

  http.get('*/catalog/status/v/:version', () => {
    return HttpResponse.json(mockStatusCatalog);
  }),

  http.get('*/catalog/element/v/:version', () => {
    return HttpResponse.json(mockElementCatalog);
  }),

  http.get('*/catalog/resonance/v/:version', () => {
    return HttpResponse.json(mockResonanceCatalog);
  }),

  http.get('*/catalog/combat-constants/v/:version', () => {
    return HttpResponse.json(mockCombatConstantsCatalog);
  }),
];
