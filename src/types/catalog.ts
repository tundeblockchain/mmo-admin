export type CatalogType =
  | 'class'
  | 'skill'
  | 'combat-constants'
  | 'status'
  | 'element'
  | 'resonance';

export interface CatalogVersionSummary {
  catalogType: CatalogType;
  version: number;
  status: 'published';
  publishedAt: string;
}

export interface CatalogVersionList {
  versions: CatalogVersionSummary[];
}

export interface LatestVersions {
  versions: Record<CatalogType, number>;
  timestamp: string;
}

export interface PrimaryStats {
  strength: number;
  finesse: number;
  vitality: number;
  intellect: number;
  precision: number;
  luck: number;
  tech: number;
}

export interface ClassStartingStats extends PrimaryStats {
  hp: number;
  resourcePool: number;
  armor: number;
  attackPower: number;
  spellPower: number;
  movementSpeed: number;
}

export type ClassRole = 'tank' | 'healer' | 'dps' | 'support';
export type ClassId = 'vanguard' | 'ranger' | 'arcanist' | 'machinist' | 'warden' | 'shade';
export type PrimaryResource = 'resolve' | 'focus' | 'mana' | 'charge' | 'radiance' | 'momentum';
export type ResonanceId = 'valor' | 'precision' | 'arcana' | 'innovation' | 'sanctuary' | 'subterfuge';

export interface ClassDefinition {
  classId: ClassId;
  displayName: string;
  description: string;
  primaryResource: PrimaryResource;
  secondaryResource?: string;
  startingStats: ClassStartingStats;
  resonance: ResonanceId;
  roles: ClassRole[];
}

export type ScalingStat =
  | 'attackPower'
  | 'spellPower'
  | 'techPower'
  | 'devicePower'
  | 'healingPower'
  | 'maxHp'
  | 'missingHp'
  | 'missingHpPercent'
  | 'armor'
  | 'level'
  | 'strength'
  | 'finesse'
  | 'vitality'
  | 'intellect'
  | 'precision'
  | 'luck'
  | 'tech';

export interface ScalingVector {
  stat: ScalingStat;
  coefficient: number;
}

export type ElementId = 'physical' | 'fire' | 'ice' | 'lightning' | 'arcane' | 'nature' | 'shadow' | 'radiant';

export interface SkillCoefficients {
  basePower: number;
  scaling: ScalingVector[];
  element?: ElementId;
  appliesStatus?: string;
  effectDuration?: number;
  perStack?: {
    basePowerPerStack: number[];
  };
  conditionals?: Array<{
    condition: string;
    threshold?: number;
    basePower?: number;
    damageMultiplier?: number;
  }>;
}

export interface SkillTiming {
  castMs: number;
  activeMs: number;
  recoveryMs: number;
  activePhaseType?: string;
}

export interface StaggerCoefficients {
  staggerPower: number;
  canStagger: boolean;
  staggerResist?: number;
  perStackStagger?: number;
  staggerPerHit?: number;
  bonusStagger?: {
    condition: string;
    value: number;
  };
  statusBuildup?: {
    status: string;
    value: number;
  };
}

export interface ResourceEffect {
  resourceId: string;
  amount: number;
  isPercentOfMax: boolean;
  perTargetBonus?: number;
}

export interface PvPMultipliers {
  damageMultiplier?: number;
  healingMultiplier?: number;
  durationMultiplier?: number;
  durationSeconds?: number;
  cooldownMultiplier?: number;
  cooldownSeconds?: number;
  staggerMultiplier?: number;
  resourceOverride?: {
    resourceId: string;
    amount: number;
  };
  maxTargets?: number;
  maxHitsPerTarget?: number;
  effectOverrides?: Record<string, number>;
}

export type SkillKind = 'active' | 'passive' | 'reaction';

export interface SkillDefinition {
  skillId: string;
  classId: ClassId;
  displayName: string;
  description: string;
  kind: SkillKind;
  resourceId: string | null;
  resourceCost: number;
  resourceEffects?: ResourceEffect[];
  cooldownSeconds: number;
  internalCooldownSeconds?: number;
  charges: number;
  chargeRechargeSeconds: number;
  castTimeSeconds: number;
  castableWhileMoving: boolean;
  range: number;
  coefficients: SkillCoefficients;
  timing?: SkillTiming;
  stagger?: StaggerCoefficients;
  pvpMultipliers?: PvPMultipliers;
  antiDeathDurationSeconds?: number;
  exhaustedDurationSeconds?: number;
  unlockLevel: number;
  iconPath: string;
}

export type StatusCategory = 'buff' | 'debuff' | 'dot' | 'hot' | 'control';

export interface StatusDefinition {
  statusId: string;
  displayName: string;
  description: string;
  category: StatusCategory;
  maxStacks: number;
  dispellable: boolean;
  persistsThroughDeath: boolean;
  iconPath: string;
}

export interface ElementDefinition {
  elementId: ElementId;
  displayName: string;
  color: string;
  strongAgainst: Record<string, number>;
  weakAgainst: Record<string, number>;
}

export interface ResonancePartyBonus {
  stat: string;
  bonusPercent: number;
}

export interface ResonanceDefinition {
  resonanceId: ResonanceId;
  displayName: string;
  description: string;
  partyBonus: ResonancePartyBonus[];
}

export interface PowerScalingConstants {
  physicalPower: {
    strengthMultiplier: number;
    levelMultiplier: number;
  };
  spellPower: {
    intellectMultiplier: number;
    levelMultiplier: number;
  };
  techPower: {
    techMultiplier: number;
    levelMultiplier: number;
  };
  devicePower: {
    techDivisor: number;
  };
}

export interface CombatConstantsData {
  powerScaling: PowerScalingConstants;
  speed?: {
    attackSpeed?: {
      finesseConstant: number;
      attackSpeedCap: number;
    };
    dodgeRecovery?: {
      finesseConstant: number;
    };
  };
  vitality?: {
    maxHp?: {
      vitalityDivisor: number;
    };
    healingReceived?: {
      vitalityDivisor: number;
    };
  };
  accuracy?: {
    baseHitChance: number;
    accuracyBonus?: {
      precisionConstant: number;
      maxAccuracyBonus: number;
    };
    weakPoint?: {
      precisionMultiplier: number;
    };
  };
  critical: {
    baseCritChance: number;
    critChance: {
      luckConstant: number;
      maxLuckCritBonus: number;
    };
    procChance: {
      luckDivisor: number;
    };
    criticalDamageMultiplier: number;
  };
  defense: {
    defenseConstant: {
      baseConstant: number;
      levelMultiplier: number;
    };
    armorReductionPerPoint: number;
    maxArmorReduction: number;
    blockDamageReduction: number;
  };
  glancingHit?: {
    damageMultiplier: number;
    canCrit: boolean;
    canStagger: boolean;
  };
  status?: {
    resistanceConstant: number;
  };
  statAllocationBands?: Array<{
    minLevel: number;
    maxLevel: number;
    pointsPerLevel: number;
    allocationCostPerPoint: number;
  }>;
  statCaps?: {
    softCap: number;
    hardCap: number;
    softCapPenalty: number;
  };
  dodge?: {
    baseDodgeChance: number;
    maxDodgeChance: number;
  };
  timing?: {
    globalCooldown: number;
    outOfCombatHpRegen: number;
    outOfCombatResourceRegen: number;
    combatDropoffSeconds: number;
  };
  stagger?: {
    baseStaggerThreshold: number;
    staggerRecoveryRate: number;
    staggerDurationSeconds: number;
    staggerImmunitySeconds: number;
  };
  pvp?: {
    globalDamageMultiplier: number;
    globalHealingMultiplier: number;
    ccDurationMultiplier: number;
    executeThresholdModifier: number;
  };
  additionalConstants?: Record<string, number | boolean | string>;
}

export interface CatalogData<T> {
  catalogType: CatalogType;
  version: number;
  status: 'published';
  createdAt: string;
  publishedAt?: string;
  createdBy: string;
  releaseNotes?: string;
  data: T;
}

export type ClassCatalogData = CatalogData<ClassDefinition[]>;
export type SkillCatalogData = CatalogData<SkillDefinition[]>;
export type StatusCatalogData = CatalogData<StatusDefinition[]>;
export type ElementCatalogData = CatalogData<ElementDefinition[]>;
export type ResonanceCatalogData = CatalogData<ResonanceDefinition[]>;
export type CombatConstantsCatalogData = CatalogData<CombatConstantsData>;

export type AnyCatalogData =
  | ClassCatalogData
  | SkillCatalogData
  | StatusCatalogData
  | ElementCatalogData
  | ResonanceCatalogData
  | CombatConstantsCatalogData;
