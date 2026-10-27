import {
  ENUM_ERROR,
  HEX_COLOR_ERROR,
  HEX_COLOR_PATTERN,
  NUMBER_ERROR,
  OBJECT_ERROR,
  REQUIRED_ERROR,
  STATUS_CATEGORIES,
} from '../catalogSchema';
import type {
  ElementDefinition,
  ResonanceDefinition,
  ResonancePartyBonus,
  StatusCategory,
  StatusDefinition,
} from '../../types/catalog';
import {
  isRecord,
  pushError,
  readArray,
  readBoolean,
  readEnum,
  readNumber,
  readObject,
  readString,
} from './parseHelpers';
import type { FieldError } from './types';

export function parseStatusDefinition(
  value: unknown,
  path: string,
  errors: FieldError[],
): StatusDefinition | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }

  const statusId = readString(value, 'statusId', `${path}.statusId`, errors);
  const displayName = readString(value, 'displayName', `${path}.displayName`, errors);
  const description = readString(value, 'description', `${path}.description`, errors);
  const categoryRaw = readString(value, 'category', `${path}.category`, errors);
  const category = readEnum<StatusCategory>(
    categoryRaw,
    STATUS_CATEGORIES,
    `${path}.category`,
    errors,
    ENUM_ERROR,
  );
  const maxStacks = readNumber(value, 'maxStacks', `${path}.maxStacks`, errors);
  const dispellable = readBoolean(value, 'dispellable', `${path}.dispellable`, errors);
  const persistsThroughDeath = readBoolean(
    value,
    'persistsThroughDeath',
    `${path}.persistsThroughDeath`,
    errors,
  );
  const iconPath = readString(value, 'iconPath', `${path}.iconPath`, errors);

  if (
    statusId === undefined ||
    displayName === undefined ||
    description === undefined ||
    category === undefined ||
    maxStacks === undefined ||
    dispellable === undefined ||
    persistsThroughDeath === undefined ||
    iconPath === undefined
  ) {
    return undefined;
  }

  return {
    statusId,
    displayName,
    description,
    category,
    maxStacks,
    dispellable,
    persistsThroughDeath,
    iconPath,
  };
}

export function parseElementDefinition(
  value: unknown,
  path: string,
  errors: FieldError[],
): ElementDefinition | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }

  const elementId = readString(value, 'elementId', `${path}.elementId`, errors);
  const displayName = readString(value, 'displayName', `${path}.displayName`, errors);
  const color = readString(value, 'color', `${path}.color`, errors);
  if (color !== undefined && color.trim() !== '' && !HEX_COLOR_PATTERN.test(color)) {
    pushError(errors, `${path}.color`, HEX_COLOR_ERROR);
  }
  const strongAgainst = readNumberRecord(value, 'strongAgainst', `${path}.strongAgainst`, errors);
  const weakAgainst = readNumberRecord(value, 'weakAgainst', `${path}.weakAgainst`, errors);

  if (
    elementId === undefined ||
    displayName === undefined ||
    color === undefined ||
    strongAgainst === undefined ||
    weakAgainst === undefined
  ) {
    return undefined;
  }

  return { elementId, displayName, color, strongAgainst, weakAgainst };
}

export function parseResonanceDefinition(
  value: unknown,
  path: string,
  errors: FieldError[],
): ResonanceDefinition | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }

  const resonanceId = readString(value, 'resonanceId', `${path}.resonanceId`, errors);
  const displayName = readString(value, 'displayName', `${path}.displayName`, errors);
  const description = readString(value, 'description', `${path}.description`, errors);
  const bonuses = readArray(value, 'partyBonus', `${path}.partyBonus`, errors);
  const partyBonus = bonuses ? parsePartyBonuses(bonuses, `${path}.partyBonus`, errors) : undefined;

  if (
    resonanceId === undefined ||
    displayName === undefined ||
    description === undefined ||
    partyBonus === undefined
  ) {
    return undefined;
  }

  return { resonanceId, displayName, description, partyBonus };
}

function readNumberRecord(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): Record<string, number> | undefined {
  const value = readObject(record, key, path, errors);
  if (!value) {
    return undefined;
  }

  const parsed: Record<string, number> = {};
  let valid = true;
  Object.entries(value).forEach(([entryKey, entryValue]) => {
    if (entryKey.trim() === '') {
      pushError(errors, `${path}.key`, REQUIRED_ERROR);
      valid = false;
      return;
    }
    if (typeof entryValue !== 'number' || !Number.isFinite(entryValue)) {
      pushError(errors, `${path}.${entryKey}`, NUMBER_ERROR);
      valid = false;
      return;
    }
    parsed[entryKey] = entryValue;
  });

  return valid ? parsed : undefined;
}

function parsePartyBonuses(
  bonuses: unknown[],
  path: string,
  errors: FieldError[],
): ResonancePartyBonus[] | undefined {
  const parsed: ResonancePartyBonus[] = [];
  let valid = true;
  bonuses.forEach((bonus, index) => {
    if (!isRecord(bonus)) {
      pushError(errors, `${path}.${index}`, OBJECT_ERROR);
      valid = false;
      return;
    }
    const stat = readString(bonus, 'stat', `${path}.${index}.stat`, errors);
    const bonusPercent = readNumber(bonus, 'bonusPercent', `${path}.${index}.bonusPercent`, errors);
    if (stat === undefined || bonusPercent === undefined) {
      valid = false;
      return;
    }
    if (stat.trim() === '') {
      pushError(errors, `${path}.${index}.stat`, REQUIRED_ERROR);
      valid = false;
      return;
    }
    parsed.push({ stat, bonusPercent });
  });
  return valid ? parsed : undefined;
}
