import type { CatalogType } from '../types/catalog';
import { CATALOG_TYPES, DRAFT_STORAGE_PREFIX, isCatalogType } from './draftKeys';

export function readStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota, private mode, or disabled storage must not break editing.
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures when clearing a draft.
  }
}

export function parseDraftStorageKey(
  key: string,
): { catalogType: CatalogType; sourceVersion: number } | null {
  if (!key.startsWith(DRAFT_STORAGE_PREFIX)) {
    return null;
  }

  const rest = key.slice(DRAFT_STORAGE_PREFIX.length);
  const separatorIndex = rest.lastIndexOf(':');
  if (separatorIndex <= 0) {
    return null;
  }

  const catalogType = rest.slice(0, separatorIndex);
  const sourceVersion = Number(rest.slice(separatorIndex + 1));

  if (!isCatalogType(catalogType) || !Number.isInteger(sourceVersion) || sourceVersion < 1) {
    return null;
  }

  return { catalogType, sourceVersion };
}

export function collectDraftStorageKeys(): string[] {
  const keys: string[] = [];

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(DRAFT_STORAGE_PREFIX)) {
        keys.push(key);
      }
    }
  } catch {
    return [];
  }

  return keys;
}

export { CATALOG_TYPES };
