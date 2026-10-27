import { ENUM_ERROR, OBJECT_ERROR, REQUIRED_ERROR } from '../catalogSchema';
import { ACTIVE_PHASE_TYPES } from '../catalogSchema';
import type {
  ActivePhaseType,
  SkillDefinition,
  SkillTiming,
  StaggerCoefficients,
} from '../../types/catalog';
import {
  isRecord,
  pushError,
  readBoolean,
  readEnum,
  readNumber,
  readOptionalNumber,
  readOptionalObject,
  readOptionalString,
  readString,
} from './parseHelpers';
import { parsePvp } from './parseSkillPvp';
import type { FieldError } from './types';

export function parseSkillOptional(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): Partial<SkillDefinition> | undefined {
  const internalCooldownSeconds = readOptionalNumber(
    record,
    'internalCooldownSeconds',
    `${path}.internalCooldownSeconds`,
    errors,
  );
  const antiDeathDurationSeconds = readOptionalNumber(
    record,
    'antiDeathDurationSeconds',
    `${path}.antiDeathDurationSeconds`,
    errors,
  );
  const exhaustedDurationSeconds = readOptionalNumber(
    record,
    'exhaustedDurationSeconds',
    `${path}.exhaustedDurationSeconds`,
    errors,
  );
  const timing = parseTiming(record, `${path}.timing`, errors);
  const stagger = parseStagger(record, `${path}.stagger`, errors);
  const pvpMultipliers = parsePvp(record, `${path}.pvpMultipliers`, errors);

  if (timing === undefined || stagger === undefined || pvpMultipliers === undefined) {
    return undefined;
  }

  return {
    ...(internalCooldownSeconds !== undefined ? { internalCooldownSeconds } : {}),
    ...(antiDeathDurationSeconds !== undefined ? { antiDeathDurationSeconds } : {}),
    ...(exhaustedDurationSeconds !== undefined ? { exhaustedDurationSeconds } : {}),
    ...(timing ? { timing } : {}),
    ...(stagger ? { stagger } : {}),
    ...(pvpMultipliers ? { pvpMultipliers } : {}),
  };
}

function parseTiming(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): SkillTiming | null | undefined {
  const value = record.timing;
  if (value === undefined) {
    return null;
  }
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  const castMs = readNumber(value, 'castMs', `${path}.castMs`, errors);
  const activeMs = readNumber(value, 'activeMs', `${path}.activeMs`, errors);
  const recoveryMs = readNumber(value, 'recoveryMs', `${path}.recoveryMs`, errors);
  const phaseRaw = readOptionalString(value, 'activePhaseType', `${path}.activePhaseType`, errors);
  const activePhaseType = readEnum<ActivePhaseType>(
    phaseRaw,
    ACTIVE_PHASE_TYPES,
    `${path}.activePhaseType`,
    errors,
    ENUM_ERROR,
  );
  if (castMs === undefined || activeMs === undefined || recoveryMs === undefined) {
    return undefined;
  }
  if (phaseRaw !== undefined && activePhaseType === undefined) {
    return undefined;
  }
  return {
    castMs,
    activeMs,
    recoveryMs,
    ...(activePhaseType !== undefined ? { activePhaseType } : {}),
  };
}

function parseStagger(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): StaggerCoefficients | null | undefined {
  const value = record.stagger;
  if (value === undefined) {
    return null;
  }
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  const staggerPower = readNumber(value, 'staggerPower', `${path}.staggerPower`, errors);
  const canStagger = readBoolean(value, 'canStagger', `${path}.canStagger`, errors);
  const staggerResist = readOptionalNumber(value, 'staggerResist', `${path}.staggerResist`, errors);
  const perStackStagger = readOptionalNumber(value, 'perStackStagger', `${path}.perStackStagger`, errors);
  const staggerPerHit = readOptionalNumber(value, 'staggerPerHit', `${path}.staggerPerHit`, errors);
  const bonusStagger = parseNamedValue(value, 'bonusStagger', `${path}.bonusStagger`, 'condition', errors);
  const statusBuildup = parseNamedValue(value, 'statusBuildup', `${path}.statusBuildup`, 'status', errors);
  if (staggerPower === undefined || canStagger === undefined) {
    return undefined;
  }
  if (bonusStagger === undefined || statusBuildup === undefined) {
    return undefined;
  }
  return {
    staggerPower,
    canStagger,
    ...(staggerResist !== undefined ? { staggerResist } : {}),
    ...(perStackStagger !== undefined ? { perStackStagger } : {}),
    ...(staggerPerHit !== undefined ? { staggerPerHit } : {}),
    ...(bonusStagger ? { bonusStagger } : {}),
    ...(statusBuildup ? { statusBuildup } : {}),
  };
}

function parseNamedValue(
  record: Record<string, unknown>,
  key: string,
  path: string,
  nameKey: 'condition' | 'status',
  errors: FieldError[],
): { [K in typeof nameKey]: string } & { value: number } | null | undefined {
  const value = readOptionalObject(record, key, path, errors);
  if (value === undefined) {
    return null;
  }
  const name = readString(value, nameKey, `${path}.${nameKey}`, errors);
  const amount = readNumber(value, 'value', `${path}.value`, errors);
  if (name === undefined || amount === undefined) {
    return undefined;
  }
  if (name.trim() === '') {
    pushError(errors, `${path}.${nameKey}`, REQUIRED_ERROR);
    return undefined;
  }
  return { [nameKey]: name, value: amount } as { [K in typeof nameKey]: string } & { value: number };
}
