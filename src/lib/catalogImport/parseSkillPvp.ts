import { OBJECT_ERROR, REQUIRED_ERROR } from '../catalogSchema';
import type { PvPMultipliers } from '../../types/catalog';
import {
  isRecord,
  pushError,
  readNumber,
  readOptionalNumber,
  readOptionalObject,
  readString,
} from './parseHelpers';
import type { FieldError } from './types';

export function parsePvp(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): PvPMultipliers | null | undefined {
  const value = record.pvpMultipliers;
  if (value === undefined) {
    return null;
  }
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  return parsePvpFields(value, path, errors);
}

function parsePvpFields(
  value: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): PvPMultipliers | undefined {
  const numericKeys = [
    'damageMultiplier',
    'healingMultiplier',
    'durationMultiplier',
    'durationSeconds',
    'cooldownMultiplier',
    'cooldownSeconds',
    'staggerMultiplier',
  ] as const;
  const parsed: PvPMultipliers = {};
  for (const key of numericKeys) {
    const amount = readOptionalNumber(value, key, `${path}.${key}`, errors);
    if (amount !== undefined) {
      parsed[key] = amount;
    }
  }
  const maxTargets = readOptionalNumber(value, 'maxTargets', `${path}.maxTargets`, errors);
  const maxHitsPerTarget = readOptionalNumber(
    value,
    'maxHitsPerTarget',
    `${path}.maxHitsPerTarget`,
    errors,
  );
  if (maxTargets !== undefined) {
    parsed.maxTargets = maxTargets;
  }
  if (maxHitsPerTarget !== undefined) {
    parsed.maxHitsPerTarget = maxHitsPerTarget;
  }
  const resourceOverride = parseResourceOverride(value, `${path}.resourceOverride`, errors);
  const effectOverrides = parseEffectOverrides(value, `${path}.effectOverrides`, errors);
  if (resourceOverride === undefined || effectOverrides === undefined) {
    return undefined;
  }
  return {
    ...parsed,
    ...(resourceOverride ? { resourceOverride } : {}),
    ...(effectOverrides ? { effectOverrides } : {}),
  };
}

function parseResourceOverride(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): PvPMultipliers['resourceOverride'] | null | undefined {
  const value = readOptionalObject(record, 'resourceOverride', path, errors);
  if (value === undefined) {
    return null;
  }
  const resourceId = readString(value, 'resourceId', `${path}.resourceId`, errors);
  const amount = readNumber(value, 'amount', `${path}.amount`, errors);
  if (resourceId === undefined || amount === undefined) {
    return undefined;
  }
  if (resourceId.trim() === '') {
    pushError(errors, `${path}.resourceId`, REQUIRED_ERROR);
    return undefined;
  }
  return { resourceId, amount };
}

function parseEffectOverrides(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): Record<string, number> | null | undefined {
  const value = readOptionalObject(record, 'effectOverrides', path, errors);
  if (value === undefined) {
    return null;
  }
  const parsed: Record<string, number> = {};
  let valid = true;
  Object.entries(value).forEach(([key, amount]) => {
    if (key.trim() === '') {
      pushError(errors, `${path}.key`, REQUIRED_ERROR);
      valid = false;
      return;
    }
    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
      pushError(errors, `${path}.${key}`, 'Must be a number');
      valid = false;
      return;
    }
    parsed[key] = amount;
  });
  return valid ? parsed : undefined;
}
