import {
  CLASS_ROLES,
  ENUM_ERROR,
  PRIMARY_RESOURCES,
  REQUIRED_ERROR,
} from '../catalogSchema';
import type { ClassDefinition, ClassRole, PrimaryResource } from '../../types/catalog';
import {
  isRecord,
  pushError,
  readArray,
  readEnum,
  readNumber,
  readObject,
  readOptionalString,
  readString,
} from './parseHelpers';
import type { FieldError } from './types';

const STARTING_STAT_KEYS = [
  'strength',
  'finesse',
  'vitality',
  'intellect',
  'precision',
  'luck',
  'tech',
  'hp',
  'resourcePool',
  'armor',
  'attackPower',
  'spellPower',
  'movementSpeed',
] as const;

export function parseClassDefinition(
  value: unknown,
  path: string,
  errors: FieldError[],
): ClassDefinition | undefined {
  if (!isRecord(value)) {
    pushError(errors, path, 'Must be an object');
    return undefined;
  }

  const classId = readString(value, 'classId', `${path}.classId`, errors);
  const displayName = readString(value, 'displayName', `${path}.displayName`, errors);
  const description = readString(value, 'description', `${path}.description`, errors);
  const primaryRaw = readString(value, 'primaryResource', `${path}.primaryResource`, errors);
  const primaryResource = readEnum<PrimaryResource>(
    primaryRaw,
    PRIMARY_RESOURCES,
    `${path}.primaryResource`,
    errors,
    ENUM_ERROR,
  );
  const secondaryResource = readOptionalString(
    value,
    'secondaryResource',
    `${path}.secondaryResource`,
    errors,
  );
  const resonance = readString(value, 'resonance', `${path}.resonance`, errors);
  const startingStats = parseStartingStats(value, `${path}.startingStats`, errors);
  const roles = parseRoles(value, `${path}.roles`, errors);

  if (
    classId === undefined ||
    displayName === undefined ||
    description === undefined ||
    primaryResource === undefined ||
    resonance === undefined ||
    startingStats === undefined ||
    roles === undefined
  ) {
    return undefined;
  }

  return {
    classId,
    displayName,
    description,
    primaryResource,
    ...(secondaryResource !== undefined ? { secondaryResource } : {}),
    startingStats,
    resonance,
    roles,
  };
}

function parseStartingStats(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): ClassDefinition['startingStats'] | undefined {
  const stats = readObject(record, 'startingStats', path, errors);
  if (!stats) {
    return undefined;
  }

  const parsed: Partial<ClassDefinition['startingStats']> = {};
  let valid = true;
  for (const key of STARTING_STAT_KEYS) {
    const value = readNumber(stats, key, `${path}.${key}`, errors);
    if (value === undefined) {
      valid = false;
      continue;
    }
    parsed[key] = value;
  }

  return valid ? (parsed as ClassDefinition['startingStats']) : undefined;
}

function parseRoles(
  record: Record<string, unknown>,
  path: string,
  errors: FieldError[],
): ClassRole[] | undefined {
  const roles = readArray(record, 'roles', path, errors);
  if (!roles) {
    return undefined;
  }
  if (roles.length === 0) {
    pushError(errors, path, REQUIRED_ERROR);
    return undefined;
  }

  const parsed: ClassRole[] = [];
  let valid = true;
  roles.forEach((role, index) => {
    if (typeof role !== 'string') {
      pushError(errors, `${path}.${index}`, ENUM_ERROR);
      valid = false;
      return;
    }
    const typed = readEnum<ClassRole>(role, CLASS_ROLES, `${path}.${index}`, errors, ENUM_ERROR);
    if (typed === undefined) {
      valid = false;
      return;
    }
    parsed.push(typed);
  });

  return valid ? parsed : undefined;
}
