import { INTEGER_ERROR, NUMBER_ERROR, RANGE_0_1_ERROR } from '../catalogSchema';

export type FieldErrors = Record<string, string>;

export function requireFinite(value: number, errors: FieldErrors, path: string): void {
  if (!Number.isFinite(value)) {
    errors[path] = NUMBER_ERROR;
  }
}

export function requireInteger(value: number, errors: FieldErrors, path: string): void {
  if (!Number.isFinite(value)) {
    errors[path] = NUMBER_ERROR;
    return;
  }
  if (!Number.isInteger(value)) {
    errors[path] = INTEGER_ERROR;
  }
}

export function requireOptionalInteger(
  value: number | undefined,
  errors: FieldErrors,
  path: string,
): void {
  if (value === undefined) {
    return;
  }
  requireInteger(value, errors, path);
}

export function requireOptionalFinite(
  value: number | undefined,
  errors: FieldErrors,
  path: string,
): void {
  if (value === undefined) {
    return;
  }
  requireFinite(value, errors, path);
}

export function requireRange01(value: number | undefined, errors: FieldErrors, path: string): void {
  if (value === undefined) {
    return;
  }
  if (!Number.isFinite(value)) {
    errors[path] = NUMBER_ERROR;
    return;
  }
  if (value < 0 || value > 1) {
    errors[path] = RANGE_0_1_ERROR;
  }
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
