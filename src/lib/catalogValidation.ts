import {
  ACTIVE_PHASE_TYPES,
  ENUM_ERROR,
  HEX_COLOR_ERROR,
  HEX_COLOR_PATTERN,
  INTEGER_ERROR,
  NUMBER_ERROR,
  RANGE_0_1_ERROR,
  REQUIRED_ERROR,
  SKILL_CONDITIONS,
} from './catalogSchema';
import { draftHasInvalidIds } from './catalogIds';
import type {
  CatalogEntityData,
  CatalogType,
  ClassDefinition,
  CombatConstantsData,
  ElementDefinition,
  ResonanceDefinition,
  SkillDefinition,
  StatusDefinition,
} from '../types/catalog';

export type FieldErrors = Record<string, string>;

function requireFinite(value: number, errors: FieldErrors, path: string): void {
  if (!Number.isFinite(value)) {
    errors[path] = NUMBER_ERROR;
  }
}

function requireInteger(value: number, errors: FieldErrors, path: string): void {
  if (!Number.isFinite(value)) {
    errors[path] = NUMBER_ERROR;
    return;
  }
  if (!Number.isInteger(value)) {
    errors[path] = INTEGER_ERROR;
  }
}

function requireOptionalInteger(value: number | undefined, errors: FieldErrors, path: string): void {
  if (value === undefined) {
    return;
  }
  requireInteger(value, errors, path);
}

function requireOptionalFinite(value: number | undefined, errors: FieldErrors, path: string): void {
  if (value === undefined) {
    return;
  }
  requireFinite(value, errors, path);
}

function requireRange01(value: number | undefined, errors: FieldErrors, path: string): void {
  if (value === undefined) {
    return;
  }
  if (!Number.isFinite(value)) {
    errors[path] = NUMBER_ERROR;
    return;
  }
  if (value < 0 || value > 1) {
    errors[path] = RANGE_0_1_ERROR;
  }
}

function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getClassFieldErrors(classData: ClassDefinition): FieldErrors {
  const errors: FieldErrors = {};

  for (const [key, value] of Object.entries(classData.startingStats)) {
    requireFinite(value, errors, `startingStats.${key}`);
  }

  return errors;
}

export function getSkillFieldErrors(skill: SkillDefinition): FieldErrors {
  const errors: FieldErrors = {};

  requireFinite(skill.resourceCost, errors, 'resourceCost');
  requireFinite(skill.cooldownSeconds, errors, 'cooldownSeconds');
  requireInteger(skill.charges, errors, 'charges');
  requireFinite(skill.chargeRechargeSeconds, errors, 'chargeRechargeSeconds');
  requireFinite(skill.castTimeSeconds, errors, 'castTimeSeconds');
  requireFinite(skill.range, errors, 'range');
  requireInteger(skill.unlockLevel, errors, 'unlockLevel');
  requireOptionalFinite(skill.internalCooldownSeconds, errors, 'internalCooldownSeconds');
  requireOptionalFinite(skill.antiDeathDurationSeconds, errors, 'antiDeathDurationSeconds');
  requireOptionalFinite(skill.exhaustedDurationSeconds, errors, 'exhaustedDurationSeconds');

  skill.resourceEffects?.forEach((effect, index) => {
    if (effect.resourceId.trim() === '') {
      errors[`resourceEffects.${index}.resourceId`] = REQUIRED_ERROR;
    }
    requireFinite(effect.amount, errors, `resourceEffects.${index}.amount`);
    requireOptionalFinite(effect.perTargetBonus, errors, `resourceEffects.${index}.perTargetBonus`);
  });

  requireFinite(skill.coefficients.basePower, errors, 'coefficients.basePower');
  skill.coefficients.scaling.forEach((scale, index) => {
    requireFinite(scale.coefficient, errors, `coefficients.scaling.${index}.coefficient`);
  });
  requireOptionalFinite(skill.coefficients.effectDuration, errors, 'coefficients.effectDuration');

  skill.coefficients.perStack?.basePowerPerStack.forEach((value, index) => {
    requireFinite(value, errors, `coefficients.perStack.basePowerPerStack.${index}`);
  });

  skill.coefficients.conditionals?.forEach((conditional, index) => {
    if (!SKILL_CONDITIONS.includes(conditional.condition)) {
      errors[`coefficients.conditionals.${index}.condition`] = ENUM_ERROR;
    }
    requireOptionalFinite(conditional.threshold, errors, `coefficients.conditionals.${index}.threshold`);
    requireOptionalFinite(conditional.basePower, errors, `coefficients.conditionals.${index}.basePower`);
    requireOptionalFinite(
      conditional.damageMultiplier,
      errors,
      `coefficients.conditionals.${index}.damageMultiplier`,
    );
  });

  if (skill.timing) {
    requireInteger(skill.timing.castMs, errors, 'timing.castMs');
    requireInteger(skill.timing.activeMs, errors, 'timing.activeMs');
    requireInteger(skill.timing.recoveryMs, errors, 'timing.recoveryMs');
    if (
      skill.timing.activePhaseType !== undefined &&
      !ACTIVE_PHASE_TYPES.includes(skill.timing.activePhaseType)
    ) {
      errors['timing.activePhaseType'] = ENUM_ERROR;
    }
  }

  if (skill.stagger) {
    requireFinite(skill.stagger.staggerPower, errors, 'stagger.staggerPower');
    requireRange01(skill.stagger.staggerResist, errors, 'stagger.staggerResist');
    requireOptionalFinite(skill.stagger.perStackStagger, errors, 'stagger.perStackStagger');
    requireOptionalFinite(skill.stagger.staggerPerHit, errors, 'stagger.staggerPerHit');
    if (skill.stagger.bonusStagger) {
      if (skill.stagger.bonusStagger.condition.trim() === '') {
        errors['stagger.bonusStagger.condition'] = REQUIRED_ERROR;
      }
      requireFinite(skill.stagger.bonusStagger.value, errors, 'stagger.bonusStagger.value');
    }
    if (skill.stagger.statusBuildup) {
      if (skill.stagger.statusBuildup.status.trim() === '') {
        errors['stagger.statusBuildup.status'] = REQUIRED_ERROR;
      }
      requireFinite(skill.stagger.statusBuildup.value, errors, 'stagger.statusBuildup.value');
    }
  }

  if (skill.pvpMultipliers) {
    const pvp = skill.pvpMultipliers;
    requireOptionalFinite(pvp.damageMultiplier, errors, 'pvpMultipliers.damageMultiplier');
    requireOptionalFinite(pvp.healingMultiplier, errors, 'pvpMultipliers.healingMultiplier');
    requireOptionalFinite(pvp.durationMultiplier, errors, 'pvpMultipliers.durationMultiplier');
    requireOptionalFinite(pvp.durationSeconds, errors, 'pvpMultipliers.durationSeconds');
    requireOptionalFinite(pvp.cooldownMultiplier, errors, 'pvpMultipliers.cooldownMultiplier');
    requireOptionalFinite(pvp.cooldownSeconds, errors, 'pvpMultipliers.cooldownSeconds');
    requireOptionalFinite(pvp.staggerMultiplier, errors, 'pvpMultipliers.staggerMultiplier');
    requireOptionalInteger(pvp.maxTargets, errors, 'pvpMultipliers.maxTargets');
    requireOptionalInteger(pvp.maxHitsPerTarget, errors, 'pvpMultipliers.maxHitsPerTarget');
    if (pvp.resourceOverride) {
      if (pvp.resourceOverride.resourceId.trim() === '') {
        errors['pvpMultipliers.resourceOverride.resourceId'] = REQUIRED_ERROR;
      }
      requireFinite(pvp.resourceOverride.amount, errors, 'pvpMultipliers.resourceOverride.amount');
    }
    if (pvp.effectOverrides) {
      Object.entries(pvp.effectOverrides).forEach(([key, value]) => {
        if (key.trim() === '') {
          errors['pvpMultipliers.effectOverrides.key'] = REQUIRED_ERROR;
        }
        requireFinite(value, errors, `pvpMultipliers.effectOverrides.${key}`);
      });
    }
  }

  return errors;
}

export function getStatusFieldErrors(status: StatusDefinition): FieldErrors {
  const errors: FieldErrors = {};
  requireInteger(status.maxStacks, errors, 'maxStacks');
  return errors;
}

export function getElementFieldErrors(element: ElementDefinition): FieldErrors {
  const errors: FieldErrors = {};
  if (element.color.trim() !== '' && !HEX_COLOR_PATTERN.test(element.color)) {
    errors.color = HEX_COLOR_ERROR;
  }
  Object.entries(element.strongAgainst).forEach(([key, value]) => {
    requireFinite(value, errors, `strongAgainst.${key}`);
  });
  Object.entries(element.weakAgainst).forEach(([key, value]) => {
    requireFinite(value, errors, `weakAgainst.${key}`);
  });
  return errors;
}

export function getResonanceFieldErrors(resonance: ResonanceDefinition): FieldErrors {
  const errors: FieldErrors = {};
  resonance.partyBonus.forEach((bonus, index) => {
    if (bonus.stat.trim() === '') {
      errors[`partyBonus.${index}.stat`] = REQUIRED_ERROR;
    }
    requireFinite(bonus.bonusPercent, errors, `partyBonus.${index}.bonusPercent`);
  });
  return errors;
}

export function getCombatConstantsFieldErrors(data: CombatConstantsData): FieldErrors {
  const errors: FieldErrors = {};

  requireFinite(data.powerScaling.physicalPower.strengthMultiplier, errors, 'powerScaling.physicalPower.strengthMultiplier');
  requireFinite(data.powerScaling.physicalPower.levelMultiplier, errors, 'powerScaling.physicalPower.levelMultiplier');
  requireFinite(data.powerScaling.spellPower.intellectMultiplier, errors, 'powerScaling.spellPower.intellectMultiplier');
  requireFinite(data.powerScaling.spellPower.levelMultiplier, errors, 'powerScaling.spellPower.levelMultiplier');
  requireFinite(data.powerScaling.techPower.techMultiplier, errors, 'powerScaling.techPower.techMultiplier');
  requireFinite(data.powerScaling.techPower.levelMultiplier, errors, 'powerScaling.techPower.levelMultiplier');
  requireFinite(data.powerScaling.devicePower.techDivisor, errors, 'powerScaling.devicePower.techDivisor');

  requireFinite(data.critical.baseCritChance, errors, 'critical.baseCritChance');
  requireFinite(data.critical.critChance.luckConstant, errors, 'critical.critChance.luckConstant');
  requireFinite(data.critical.critChance.maxLuckCritBonus, errors, 'critical.critChance.maxLuckCritBonus');
  requireFinite(data.critical.procChance.luckDivisor, errors, 'critical.procChance.luckDivisor');
  requireFinite(data.critical.criticalDamageMultiplier, errors, 'critical.criticalDamageMultiplier');

  requireFinite(data.defense.defenseConstant.baseConstant, errors, 'defense.defenseConstant.baseConstant');
  requireFinite(data.defense.defenseConstant.levelMultiplier, errors, 'defense.defenseConstant.levelMultiplier');
  requireFinite(data.defense.armorReductionPerPoint, errors, 'defense.armorReductionPerPoint');
  requireFinite(data.defense.maxArmorReduction, errors, 'defense.maxArmorReduction');
  requireFinite(data.defense.blockDamageReduction, errors, 'defense.blockDamageReduction');

  requireOptionalFinite(data.speed?.attackSpeed?.finesseConstant, errors, 'speed.attackSpeed.finesseConstant');
  requireOptionalFinite(data.speed?.attackSpeed?.attackSpeedCap, errors, 'speed.attackSpeed.attackSpeedCap');
  requireOptionalFinite(data.speed?.dodgeRecovery?.finesseConstant, errors, 'speed.dodgeRecovery.finesseConstant');

  requireOptionalFinite(data.vitality?.maxHp?.vitalityDivisor, errors, 'vitality.maxHp.vitalityDivisor');
  requireOptionalFinite(data.vitality?.healingReceived?.vitalityDivisor, errors, 'vitality.healingReceived.vitalityDivisor');

  requireOptionalFinite(data.accuracy?.baseHitChance, errors, 'accuracy.baseHitChance');
  requireOptionalFinite(data.accuracy?.accuracyBonus?.precisionConstant, errors, 'accuracy.accuracyBonus.precisionConstant');
  requireOptionalFinite(data.accuracy?.accuracyBonus?.maxAccuracyBonus, errors, 'accuracy.accuracyBonus.maxAccuracyBonus');
  requireOptionalFinite(data.accuracy?.weakPoint?.precisionMultiplier, errors, 'accuracy.weakPoint.precisionMultiplier');

  requireOptionalFinite(data.glancingHit?.damageMultiplier, errors, 'glancingHit.damageMultiplier');
  requireOptionalFinite(data.status?.resistanceConstant, errors, 'status.resistanceConstant');

  data.statAllocationBands?.forEach((band, index) => {
    requireInteger(band.minLevel, errors, `statAllocationBands.${index}.minLevel`);
    requireInteger(band.maxLevel, errors, `statAllocationBands.${index}.maxLevel`);
    requireInteger(band.pointsPerLevel, errors, `statAllocationBands.${index}.pointsPerLevel`);
    requireInteger(band.allocationCostPerPoint, errors, `statAllocationBands.${index}.allocationCostPerPoint`);
  });

  requireOptionalInteger(data.statCaps?.softCap, errors, 'statCaps.softCap');
  requireOptionalInteger(data.statCaps?.hardCap, errors, 'statCaps.hardCap');
  requireOptionalFinite(data.statCaps?.softCapPenalty, errors, 'statCaps.softCapPenalty');

  requireOptionalFinite(data.dodge?.baseDodgeChance, errors, 'dodge.baseDodgeChance');
  requireOptionalFinite(data.dodge?.maxDodgeChance, errors, 'dodge.maxDodgeChance');

  requireOptionalFinite(data.timing?.globalCooldown, errors, 'timing.globalCooldown');
  requireOptionalFinite(data.timing?.outOfCombatHpRegen, errors, 'timing.outOfCombatHpRegen');
  requireOptionalFinite(data.timing?.outOfCombatResourceRegen, errors, 'timing.outOfCombatResourceRegen');
  requireOptionalFinite(data.timing?.combatDropoffSeconds, errors, 'timing.combatDropoffSeconds');

  requireOptionalFinite(data.stagger?.baseStaggerThreshold, errors, 'stagger.baseStaggerThreshold');
  requireOptionalFinite(data.stagger?.staggerRecoveryRate, errors, 'stagger.staggerRecoveryRate');
  requireOptionalFinite(data.stagger?.staggerDurationSeconds, errors, 'stagger.staggerDurationSeconds');
  requireOptionalFinite(data.stagger?.staggerImmunitySeconds, errors, 'stagger.staggerImmunitySeconds');

  requireOptionalFinite(data.pvp?.globalDamageMultiplier, errors, 'pvp.globalDamageMultiplier');
  requireOptionalFinite(data.pvp?.globalHealingMultiplier, errors, 'pvp.globalHealingMultiplier');
  requireOptionalFinite(data.pvp?.ccDurationMultiplier, errors, 'pvp.ccDurationMultiplier');
  requireOptionalFinite(data.pvp?.executeThresholdModifier, errors, 'pvp.executeThresholdModifier');

  if (data.additionalConstants) {
    Object.entries(data.additionalConstants).forEach(([key, value]) => {
      if (key.trim() === '') {
        errors['additionalConstants.key'] = REQUIRED_ERROR;
      }
      if (typeof value === 'number') {
        requireFinite(value, errors, `additionalConstants.${key}`);
      }
    });
  }

  return errors;
}

export function getEntityFieldErrors(
  entity: unknown,
  catalogType: CatalogType,
): FieldErrors {
  switch (catalogType) {
    case 'class':
      return getClassFieldErrors(entity as ClassDefinition);
    case 'skill':
      return getSkillFieldErrors(entity as SkillDefinition);
    case 'status':
      return getStatusFieldErrors(entity as StatusDefinition);
    case 'element':
      return getElementFieldErrors(entity as ElementDefinition);
    case 'resonance':
      return getResonanceFieldErrors(entity as ResonanceDefinition);
    case 'combat-constants':
      return getCombatConstantsFieldErrors(entity as CombatConstantsData);
  }
}

export function draftHasFieldErrors(data: CatalogEntityData, catalogType: CatalogType): boolean {
  if (catalogType === 'combat-constants') {
    return hasErrors(getCombatConstantsFieldErrors(data as CombatConstantsData));
  }

  return (data as unknown[]).some((entity) => hasErrors(getEntityFieldErrors(entity, catalogType)));
}

export function draftHasValidationErrors(
  data: CatalogEntityData,
  catalogType: CatalogType,
): boolean {
  return draftHasInvalidIds(data, catalogType) || draftHasFieldErrors(data, catalogType);
}
