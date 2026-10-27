import {
  ENUM_ERROR,
  NUMBER_ERROR,
  OBJECT_ERROR,
  SCALING_STATS,
  SKILL_CONDITIONS,
} from '../catalogSchema';
import type {
  PerStackCoefficients,
  ScalingStat,
  ScalingVector,
  SkillCoefficients,
  SkillConditional,
  SkillCondition,
} from '../../types/catalog';
import {
  isRecord,
  pushError,
  readArray,
  readEnum,
  readNumber,
  readOptionalArray,
  readOptionalNumber,
  readOptionalString,
  readString,
} from './parseHelpers';
import type { FieldError } from './types';

export function parseSkillCoefficients(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): SkillCoefficients | undefined {
  const basePower = readNumber(record, 'basePower', `${path}.basePower`, errors);
  const scalingRaw = readArray(record, 'scaling', `${path}.scaling`, errors);
  const scaling = scalingRaw ? parseScaling(scalingRaw, `${path}.scaling`, errors) : undefined;
  const element = readOptionalString(record, 'element', `${path}.element`, errors);
  const appliesStatus = readOptionalString(record, 'appliesStatus', `${path}.appliesStatus`, errors);
  const effectDuration = readOptionalNumber(record, 'effectDuration', `${path}.effectDuration`, errors);
  const perStack = parsePerStack(record, `${path}.perStack`, errors);
  const conditionals = parseConditionals(record, `${path}.conditionals`, errors);

  if (basePower === undefined || scaling === undefined || perStack === undefined || conditionals === undefined) {
    return undefined;
  }

  return {
    basePower,
    scaling,
    ...(element !== undefined ? { element } : {}),
    ...(appliesStatus !== undefined ? { appliesStatus } : {}),
    ...(effectDuration !== undefined ? { effectDuration } : {}),
    ...(perStack ? { perStack } : {}),
    ...(conditionals.length > 0 ? { conditionals } : {}),
  };
}

function parseScaling(
  items: unknown[],
  path: string,
  errors: FieldError[],
): ScalingVector[] | undefined {
  const parsed: ScalingVector[] = [];
  let valid = true;
  items.forEach((item, index) => {
    if (!isRecord(item)) {
      pushError(errors, `${path}.${index}`, OBJECT_ERROR);
      valid = false;
      return;
    }
    const statRaw = readString(item, 'stat', `${path}.${index}.stat`, errors);
    const stat = readEnum<ScalingStat>(statRaw, SCALING_STATS, `${path}.${index}.stat`, errors, ENUM_ERROR);
    const coefficient = readNumber(item, 'coefficient', `${path}.${index}.coefficient`, errors);
    if (stat === undefined || coefficient === undefined) {
      valid = false;
      return;
    }
    parsed.push({ stat, coefficient });
  });
  return valid ? parsed : undefined;
}

function parsePerStack(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): PerStackCoefficients | null | undefined {
  if (record.perStack === undefined) {
    return null;
  }
  if (!isRecord(record.perStack)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  const values = readArray(record.perStack, 'basePowerPerStack', `${path}.basePowerPerStack`, errors);
  if (!values) {
    return undefined;
  }
  const parsed: number[] = [];
  let valid = true;
  values.forEach((value, index) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      pushError(errors, `${path}.basePowerPerStack.${index}`, NUMBER_ERROR);
      valid = false;
      return;
    }
    parsed.push(value);
  });
  return valid ? { basePowerPerStack: parsed } : undefined;
}

function parseConditionals(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): SkillConditional[] | undefined {
  const items = readOptionalArray(record, 'conditionals', path, errors);
  if (items === undefined) {
    return [];
  }
  const parsed: SkillConditional[] = [];
  let valid = true;
  items.forEach((item, index) => {
    const conditional = parseConditional(item, `${path}.${index}`, errors);
    if (!conditional) {
      valid = false;
      return;
    }
    parsed.push(conditional);
  });
  return valid ? parsed : undefined;
}

function parseConditional(
  value: unknown,
  path: string,
  errors: FieldError[],
): SkillConditional | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  const conditionRaw = readString(value, 'condition', `${path}.condition`, errors);
  const condition = readEnum<SkillCondition>(
    conditionRaw,
    SKILL_CONDITIONS,
    `${path}.condition`,
    errors,
    ENUM_ERROR,
  );
  const threshold = readOptionalNumber(value, 'threshold', `${path}.threshold`, errors);
  const basePower = readOptionalNumber(value, 'basePower', `${path}.basePower`, errors);
  const damageMultiplier = readOptionalNumber(
    value,
    'damageMultiplier',
    `${path}.damageMultiplier`,
    errors,
  );
  if (condition === undefined) {
    return undefined;
  }
  return {
    condition,
    ...(threshold !== undefined ? { threshold } : {}),
    ...(basePower !== undefined ? { basePower } : {}),
    ...(damageMultiplier !== undefined ? { damageMultiplier } : {}),
  };
}
