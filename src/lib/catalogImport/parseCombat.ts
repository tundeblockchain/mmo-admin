import { OBJECT_ERROR } from '../catalogSchema';
import type { CombatConstantsData, PowerScalingConstants } from '../../types/catalog';
import { isRecord, pushError, readNumber, readObject } from './parseHelpers';
import { parseOptionalCombat } from './parseCombatOptional';
import type { FieldError } from './types';

export function parseCombatConstants(
  value: unknown,
  path: string,
  errors: FieldError[],
): CombatConstantsData | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }

  const powerScalingRaw = readObject(value, 'powerScaling', `${path}.powerScaling`, errors);
  const powerScaling = powerScalingRaw
    ? parsePowerScaling(powerScalingRaw, `${path}.powerScaling`, errors)
    : undefined;
  const critical = parseCritical(value, `${path}.critical`, errors);
  const defense = parseDefense(value, `${path}.defense`, errors);
  const optional = parseOptionalCombat(value, path, errors);

  if (!powerScaling || !critical || !defense || optional === undefined) {
    return undefined;
  }

  return {
    powerScaling,
    critical,
    defense,
    ...optional,
  };
}

function parsePowerScaling(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): PowerScalingConstants | undefined {
  const physical = readPair(
    record,
    'physicalPower',
    `${path}.physicalPower`,
    'strengthMultiplier',
    'levelMultiplier',
    errors,
  );
  const spell = readPair(
    record,
    'spellPower',
    `${path}.spellPower`,
    'intellectMultiplier',
    'levelMultiplier',
    errors,
  );
  const tech = readPair(record, 'techPower', `${path}.techPower`, 'techMultiplier', 'levelMultiplier', errors);
  const deviceRaw = readObject(record, 'devicePower', `${path}.devicePower`, errors);
  const techDivisor = deviceRaw
    ? readNumber(deviceRaw, 'techDivisor', `${path}.devicePower.techDivisor`, errors)
    : undefined;

  if (!physical || !spell || !tech || techDivisor === undefined) {
    return undefined;
  }

  return {
    physicalPower: physical,
    spellPower: spell,
    techPower: tech,
    devicePower: { techDivisor },
  };
}

function readPair<K1 extends string, K2 extends string>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  first: K1,
  second: K2,
  errors: FieldError[],
): Record<K1 | K2, number> | undefined {
  const value = readObject(record, key, path, errors);
  if (!value) {
    return undefined;
  }
  const a = readNumber(value, first, `${path}.${first}`, errors);
  const b = readNumber(value, second, `${path}.${second}`, errors);
  if (a === undefined || b === undefined) {
    return undefined;
  }
  return { [first]: a, [second]: b } as Record<K1 | K2, number>;
}

function parseCritical(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): CombatConstantsData['critical'] | undefined {
  const value = readObject(record, 'critical', path, errors);
  if (!value) {
    return undefined;
  }
  const baseCritChance = readNumber(value, 'baseCritChance', `${path}.baseCritChance`, errors);
  const critChance = readPair(value, 'critChance', `${path}.critChance`, 'luckConstant', 'maxLuckCritBonus', errors);
  const procRaw = readObject(value, 'procChance', `${path}.procChance`, errors);
  const luckDivisor = procRaw
    ? readNumber(procRaw, 'luckDivisor', `${path}.procChance.luckDivisor`, errors)
    : undefined;
  const criticalDamageMultiplier = readNumber(
    value,
    'criticalDamageMultiplier',
    `${path}.criticalDamageMultiplier`,
    errors,
  );
  if (
    baseCritChance === undefined ||
    !critChance ||
    luckDivisor === undefined ||
    criticalDamageMultiplier === undefined
  ) {
    return undefined;
  }
  return {
    baseCritChance,
    critChance: {
      luckConstant: critChance.luckConstant,
      maxLuckCritBonus: critChance.maxLuckCritBonus,
    },
    procChance: { luckDivisor },
    criticalDamageMultiplier,
  };
}

function parseDefense(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): CombatConstantsData['defense'] | undefined {
  const value = readObject(record, 'defense', path, errors);
  if (!value) {
    return undefined;
  }
  const defenseConstant = readPair(
    value,
    'defenseConstant',
    `${path}.defenseConstant`,
    'baseConstant',
    'levelMultiplier',
    errors,
  );
  const armorReductionPerPoint = readNumber(
    value,
    'armorReductionPerPoint',
    `${path}.armorReductionPerPoint`,
    errors,
  );
  const maxArmorReduction = readNumber(value, 'maxArmorReduction', `${path}.maxArmorReduction`, errors);
  const blockDamageReduction = readNumber(
    value,
    'blockDamageReduction',
    `${path}.blockDamageReduction`,
    errors,
  );
  if (
    !defenseConstant ||
    armorReductionPerPoint === undefined ||
    maxArmorReduction === undefined ||
    blockDamageReduction === undefined
  ) {
    return undefined;
  }
  return {
    defenseConstant: {
      baseConstant: defenseConstant.baseConstant,
      levelMultiplier: defenseConstant.levelMultiplier,
    },
    armorReductionPerPoint,
    maxArmorReduction,
    blockDamageReduction,
  };
}
