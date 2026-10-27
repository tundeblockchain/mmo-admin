import {
  ARRAY_ERROR,
  BOOLEAN_ERROR,
  NUMBER_ERROR,
  OBJECT_ERROR,
  REQUIRED_ERROR,
  STRING_ERROR,
} from '../catalogSchema';
import type { FieldError } from './types';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function pushError(errors: FieldError[], path: string, message: string): void {
  errors.push({ path, message });
}

export function readRequired(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): unknown {
  if (!(key in record) || record[key] === undefined) {
    pushError(errors, path, REQUIRED_ERROR);
    return undefined;
  }
  return record[key];
}

export function readString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): string | undefined {
  const value = readRequired(record, key, path, errors);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    pushError(errors, path, STRING_ERROR);
    return undefined;
  }
  return value;
}

export function readOptionalString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): string | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    pushError(errors, path, STRING_ERROR);
    return undefined;
  }
  return value;
}

export function readNumber(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): number | undefined {
  const value = readRequired(record, key, path, errors);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    pushError(errors, path, NUMBER_ERROR);
    return undefined;
  }
  return value;
}

export function readOptionalNumber(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): number | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    pushError(errors, path, NUMBER_ERROR);
    return undefined;
  }
  return value;
}

export function readBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): boolean | undefined {
  const value = readRequired(record, key, path, errors);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'boolean') {
    pushError(errors, path, BOOLEAN_ERROR);
    return undefined;
  }
  return value;
}

export function readObject(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): Record<string, unknown> | undefined {
  const value = readRequired(record, key, path, errors);
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  return value;
}

export function readArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): unknown[] | undefined {
  const value = readRequired(record, key, path, errors);
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    pushError(errors, path, ARRAY_ERROR);
    return undefined;
  }
  return value;
}

export function readOptionalArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): unknown[] | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    pushError(errors, path, ARRAY_ERROR);
    return undefined;
  }
  return value;
}

export function readOptionalObject(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldError[],
): Record<string, unknown> | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    pushError(errors, path, OBJECT_ERROR);
    return undefined;
  }
  return value;
}

export function readEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  path: string,
  errors: FieldError[],
  message: string,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!(allowed as readonly string[]).includes(value)) {
    pushError(errors, path, message);
    return undefined;
  }
  return value as T;
}
