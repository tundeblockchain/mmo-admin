import {
  ACTIVE_PHASE_TYPES,
  ENUM_ERROR,
  REQUIRED_ERROR,
  SKILL_CONDITIONS,
} from '../catalogSchema';
import type { SkillDefinition } from '../../types/catalog';
import {
  requireFinite,
  requireInteger,
  requireOptionalFinite,
  requireOptionalInteger,
  requireRange01,
  type FieldErrors,
} from './fieldRules';

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
