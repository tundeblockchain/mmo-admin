import type { CombatConstantsData } from '../../types/catalog';
import { readBoolean, readOptionalNumber, readOptionalObject } from './parseHelpers';
import type { FieldError } from './types';

export function parseOptionalCombat(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): Partial<CombatConstantsData> | undefined {
  const vitality = readNestedNumber(
    record,
    ['vitality', 'healingReceived', 'vitalityDivisor'],
    `${path}.vitality.healingReceived.vitalityDivisor`,
    errors,
  );
  const weakPoint = readNestedNumber(
    record,
    ['accuracy', 'weakPoint', 'precisionMultiplier'],
    `${path}.accuracy.weakPoint.precisionMultiplier`,
    errors,
  );
  const glancingHit = parseGlancing(record, `${path}.glancingHit`, errors);
  const resistanceConstant = readNestedNumber(
    record,
    ['status', 'resistanceConstant'],
    `${path}.status.resistanceConstant`,
    errors,
  );
  const globalCooldown = readNestedNumber(
    record,
    ['timing', 'globalCooldown'],
    `${path}.timing.globalCooldown`,
    errors,
  );
  const pvp = parsePvp(record, `${path}.pvp`, errors);

  if (glancingHit === undefined || pvp === undefined) {
    return undefined;
  }

  return {
    ...(vitality !== undefined ? { vitality: { healingReceived: { vitalityDivisor: vitality } } } : {}),
    ...(weakPoint !== undefined ? { accuracy: { weakPoint: { precisionMultiplier: weakPoint } } } : {}),
    ...(glancingHit ? { glancingHit } : {}),
    ...(resistanceConstant !== undefined ? { status: { resistanceConstant } } : {}),
    ...(globalCooldown !== undefined ? { timing: { globalCooldown } } : {}),
    ...(pvp ? { pvp } : {}),
  };
}

function readNestedNumber(
  record: Record<string, unknown>,
  keys: string[],
  path: string,
  errors: FieldError[],
): number | undefined {
  let current: unknown = record;
  for (const key of keys.slice(0, -1)) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    const next = (current as Record<string, unknown>)[key];
    if (next === undefined) {
      return undefined;
    }
    current = next;
  }
  if (!current || typeof current !== 'object' || Array.isArray(current)) {
    return undefined;
  }
  const leaf = keys[keys.length - 1];
  return readOptionalNumber(current as Record<string, unknown>, leaf, path, errors);
}

function parseGlancing(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): CombatConstantsData['glancingHit'] | null | undefined {
  const value = readOptionalObject(record, 'glancingHit', path, errors);
  if (value === undefined) {
    return null;
  }
  const damageMultiplier = readOptionalNumber(value, 'damageMultiplier', `${path}.damageMultiplier`, errors);
  const canCrit =
    value.canCrit === undefined ? undefined : readBoolean(value, 'canCrit', `${path}.canCrit`, errors);
  const canStagger =
    value.canStagger === undefined
      ? undefined
      : readBoolean(value, 'canStagger', `${path}.canStagger`, errors);
  if (canCrit === undefined && value.canCrit !== undefined) {
    return undefined;
  }
  if (canStagger === undefined && value.canStagger !== undefined) {
    return undefined;
  }
  return {
    ...(damageMultiplier !== undefined ? { damageMultiplier } : {}),
    ...(canCrit !== undefined ? { canCrit } : {}),
    ...(canStagger !== undefined ? { canStagger } : {}),
  };
}

function parsePvp(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): CombatConstantsData['pvp'] | null | undefined {
  const value = readOptionalObject(record, 'pvp', path, errors);
  if (value === undefined) {
    return null;
  }
  const globalDamageMultiplier = readOptionalNumber(
    value,
    'globalDamageMultiplier',
    `${path}.globalDamageMultiplier`,
    errors,
  );
  const globalHealingMultiplier = readOptionalNumber(
    value,
    'globalHealingMultiplier',
    `${path}.globalHealingMultiplier`,
    errors,
  );
  return {
    ...(globalDamageMultiplier !== undefined ? { globalDamageMultiplier } : {}),
    ...(globalHealingMultiplier !== undefined ? { globalHealingMultiplier } : {}),
  };
}
