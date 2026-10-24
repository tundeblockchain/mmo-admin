import { REQUIRED_ERROR } from '../catalogSchema';
import type { CombatConstantsData } from '../../types/catalog';
import {
  requireFinite,
  requireInteger,
  requireOptionalFinite,
  requireOptionalInteger,
  type FieldErrors,
} from './fieldRules';

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
