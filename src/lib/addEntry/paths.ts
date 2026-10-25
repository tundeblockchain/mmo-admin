import type { AddEntryValue } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getValueAtPath(source: unknown, path: string): AddEntryValue {
  const parts = path.split('.');
  let current: unknown = source;

  for (const part of parts) {
    if (!isRecord(current)) {
      return '';
    }
    current = current[part];
  }

  if (typeof current === 'string' || typeof current === 'number' || typeof current === 'boolean') {
    return current;
  }

  if (Array.isArray(current) && current.every((item) => typeof item === 'string')) {
    return current;
  }

  return '';
}

export function setValueAtPath(
  target: Record<string, unknown>,
  path: string,
  value: AddEntryValue,
): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = target;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const next = current[part];
    if (!isRecord(next)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}
