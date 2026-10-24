import type { CatalogData } from './common';

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
      finesseConstant?: number;
      attackSpeedCap?: number;
    };
    dodgeRecovery?: {
      finesseConstant?: number;
    };
  };
  vitality?: {
    maxHp?: {
      vitalityDivisor?: number;
    };
    healingReceived?: {
      vitalityDivisor?: number;
    };
  };
  accuracy?: {
    baseHitChance?: number;
    accuracyBonus?: {
      precisionConstant?: number;
      maxAccuracyBonus?: number;
    };
    weakPoint?: {
      precisionMultiplier?: number;
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
    damageMultiplier?: number;
    canCrit?: boolean;
    canStagger?: boolean;
  };
  status?: {
    resistanceConstant?: number;
  };
  statAllocationBands?: Array<{
    minLevel: number;
    maxLevel: number;
    pointsPerLevel: number;
    allocationCostPerPoint: number;
  }>;
  statCaps?: {
    softCap?: number;
    hardCap?: number;
    softCapPenalty?: number;
  };
  dodge?: {
    baseDodgeChance?: number;
    maxDodgeChance?: number;
  };
  timing?: {
    globalCooldown?: number;
    outOfCombatHpRegen?: number;
    outOfCombatResourceRegen?: number;
    combatDropoffSeconds?: number;
  };
  stagger?: {
    baseStaggerThreshold?: number;
    staggerRecoveryRate?: number;
    staggerDurationSeconds?: number;
    staggerImmunitySeconds?: number;
  };
  pvp?: {
    globalDamageMultiplier?: number;
    globalHealingMultiplier?: number;
    ccDurationMultiplier?: number;
    executeThresholdModifier?: number;
  };
  additionalConstants?: Record<string, number | boolean | string>;
}

export type CombatConstantsCatalogData = CatalogData<CombatConstantsData>;
