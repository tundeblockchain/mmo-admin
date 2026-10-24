import type { CatalogData } from './common';
import type { ClassId } from './class';

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

export type ElementId = string;

export type ActivePhaseType =
  | 'standard'
  | 'hold'
  | 'stance'
  | 'reaction'
  | 'deploy'
  | 'buff'
  | 'summon'
  | 'channel';

export type SkillCondition =
  | 'marked'
  | 'below_hp_threshold'
  | 'above_hp_threshold'
  | 'perfect_timing'
  | 'flanking'
  | 'stealthed'
  | 'boss_target';

export interface PerStackCoefficients {
  basePowerPerStack: number[];
}

export interface SkillConditional {
  condition: SkillCondition;
  threshold?: number;
  basePower?: number;
  damageMultiplier?: number;
}

export interface SkillCoefficients {
  basePower: number;
  scaling: ScalingVector[];
  element?: ElementId;
  appliesStatus?: string;
  effectDuration?: number;
  perStack?: PerStackCoefficients;
  conditionals?: SkillConditional[];
}

export interface SkillTiming {
  castMs: number;
  activeMs: number;
  recoveryMs: number;
  activePhaseType?: ActivePhaseType;
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

export type SkillCatalogData = CatalogData<SkillDefinition[]>;
