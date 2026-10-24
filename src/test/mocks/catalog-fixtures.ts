import type {
  CatalogVersionList,
  LatestVersions,
  StatusCatalogData,
  ElementCatalogData,
  ResonanceCatalogData,
  CombatConstantsCatalogData,
} from '../../types/catalog';

export { mockClassCatalog, mockSkillCatalog } from './catalog-class-skill-fixtures';

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
    statCaps: {
      softCap: 100,
      hardCap: 150,
      softCapPenalty: 0.5,
    },
    dodge: {
      baseDodgeChance: 0.02,
      maxDodgeChance: 0.4,
    },
  },
};
