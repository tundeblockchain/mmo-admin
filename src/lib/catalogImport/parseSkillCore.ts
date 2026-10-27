import {
  ENUM_ERROR,
  OBJECT_ERROR,
  REQUIRED_ERROR,
  RESOURCE_IDS,
  SKILL_KINDS,
  STRING_ERROR,
} from '../catalogSchema';
import type { ResourceEffect, SkillDefinition, SkillKind } from '../../types/catalog';
import {
  isRecord,
  pushError,
  readBoolean,
  readEnum,
  readNumber,
  readObject,
  readOptionalArray,
  readOptionalNumber,
  readString,
} from './parseHelpers';
import type { FieldError } from './types';
import { parseSkillCoefficients } from './parseSkillCoefficients';
import { parseSkillOptional } from './parseSkillOptional';

export function parseSkillDefinition(
  value: unknown,
  path: string,
  errors: FieldError[],
): SkillDefinition | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }

  const skillId = readString(value, 'skillId', `${path}.skillId`, errors);
  const classId = readString(value, 'classId', `${path}.classId`, errors);
  const displayName = readString(value, 'displayName', `${path}.displayName`, errors);
  const description = readString(value, 'description', `${path}.description`, errors);
  const kindRaw = readString(value, 'kind', `${path}.kind`, errors);
  const kind = readEnum<SkillKind>(kindRaw, SKILL_KINDS, `${path}.kind`, errors, ENUM_ERROR);
  const resourceId = readNullableResource(value, `${path}.resourceId`, errors);
  const resourceCost = readNumber(value, 'resourceCost', `${path}.resourceCost`, errors);
  const cooldownSeconds = readNumber(value, 'cooldownSeconds', `${path}.cooldownSeconds`, errors);
  const charges = readNumber(value, 'charges', `${path}.charges`, errors);
  const chargeRechargeSeconds = readNumber(
    value,
    'chargeRechargeSeconds',
    `${path}.chargeRechargeSeconds`,
    errors,
  );
  const castTimeSeconds = readNumber(value, 'castTimeSeconds', `${path}.castTimeSeconds`, errors);
  const castableWhileMoving = readBoolean(
    value,
    'castableWhileMoving',
    `${path}.castableWhileMoving`,
    errors,
  );
  const range = readNumber(value, 'range', `${path}.range`, errors);
  const unlockLevel = readNumber(value, 'unlockLevel', `${path}.unlockLevel`, errors);
  const iconPath = readString(value, 'iconPath', `${path}.iconPath`, errors);
  const coefficientsRaw = readObject(value, 'coefficients', `${path}.coefficients`, errors);
  const coefficients = coefficientsRaw
    ? parseSkillCoefficients(coefficientsRaw, `${path}.coefficients`, errors)
    : undefined;
  const optional = parseSkillOptional(value, path, errors);
  const resourceEffects = parseResourceEffects(value, `${path}.resourceEffects`, errors);

  if (
    skillId === undefined ||
    classId === undefined ||
    displayName === undefined ||
    description === undefined ||
    kind === undefined ||
    resourceId === undefined ||
    resourceCost === undefined ||
    cooldownSeconds === undefined ||
    charges === undefined ||
    chargeRechargeSeconds === undefined ||
    castTimeSeconds === undefined ||
    castableWhileMoving === undefined ||
    range === undefined ||
    unlockLevel === undefined ||
    iconPath === undefined ||
    coefficients === undefined ||
    optional === undefined ||
    resourceEffects === undefined
  ) {
    return undefined;
  }

  return {
    skillId,
    classId,
    displayName,
    description,
    kind,
    resourceId,
    resourceCost,
    cooldownSeconds,
    charges,
    chargeRechargeSeconds,
    castTimeSeconds,
    castableWhileMoving,
    range,
    coefficients,
    unlockLevel,
    iconPath,
    ...optional,
    ...(resourceEffects.length > 0 ? { resourceEffects } : {}),
  };
}

function readNullableResource(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): string | null | undefined {
  if (!('resourceId' in record) || record.resourceId === undefined) {
    pushError(errors, path, REQUIRED_ERROR);
    return undefined;
  }
  if (record.resourceId === null) {
    return null;
  }
  if (typeof record.resourceId !== 'string') {
    pushError(errors, path, STRING_ERROR);
    return undefined;
  }
  return readEnum(record.resourceId, RESOURCE_IDS, path, errors, ENUM_ERROR) ?? undefined;
}

function parseResourceEffects(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): ResourceEffect[] | undefined {
  const items = readOptionalArray(record, 'resourceEffects', path, errors);
  if (items === undefined) {
    return [];
  }

  const parsed: ResourceEffect[] = [];
  let valid = true;
  items.forEach((item, index) => {
    const effect = parseResourceEffect(item, `${path}.${index}`, errors);
    if (!effect) {
      valid = false;
      return;
    }
    parsed.push(effect);
  });
  return valid ? parsed : undefined;
}

function parseResourceEffect(
  value: unknown,
  path: string,
  errors: FieldError[],
): ResourceEffect | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  const resourceId = readString(value, 'resourceId', `${path}.resourceId`, errors);
  const amount = readNumber(value, 'amount', `${path}.amount`, errors);
  const isPercentOfMax = readBoolean(value, 'isPercentOfMax', `${path}.isPercentOfMax`, errors);
  const perTargetBonus = readOptionalNumber(value, 'perTargetBonus', `${path}.perTargetBonus`, errors);
  if (resourceId === undefined || amount === undefined || isPercentOfMax === undefined) {
    return undefined;
  }
  if (resourceId.trim() === '') {
    pushError(errors, `${path}.resourceId`, REQUIRED_ERROR);
    return undefined;
  }
  return {
    resourceId,
    amount,
    isPercentOfMax,
    ...(perTargetBonus !== undefined ? { perTargetBonus } : {}),
  };
}
