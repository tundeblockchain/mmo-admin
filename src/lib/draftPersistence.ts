import type { CatalogType } from '../types/catalog';

export const DRAFT_STORAGE_PREFIX = 'mmo-admin:draft:';
export const DRAFT_SCHEMA_VERSION = 1;

export const CATALOG_TYPES: readonly CatalogType[] = [
  'class',
  'skill',
  'combat-constants',
  'status',
  'element',
  'resonance',
] as const;

export interface DraftWorkingCopy<T = unknown> {
  catalogType: CatalogType;
  sourceVersion: number;
  isDirty: boolean;
  data: T;
}

export interface PersistedDraftRecord<T = unknown> {
  schemaVersion: number;
  savedAt: string;
  draft: DraftWorkingCopy<T>;
}

export function draftStorageKey(
  catalogType: CatalogType,
  sourceVersion: number,
): string {
  return `${DRAFT_STORAGE_PREFIX}${catalogType}:${sourceVersion}`;
}

export function isCatalogType(value: unknown): value is CatalogType {
  return (
    typeof value === 'string' &&
    (CATALOG_TYPES as readonly string[]).includes(value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseDraftStorageKey(
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

  if (
    !isCatalogType(catalogType) ||
    !Number.isInteger(sourceVersion) ||
    sourceVersion < 1
  ) {
    return null;
  }

  return { catalogType, sourceVersion };
}

function readStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota, private mode, or disabled storage must not break editing.
  }
}

function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures when clearing a draft.
  }
}

function collectDraftStorageKeys(): string[] {
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

function isDraftWorkingCopy(value: unknown): value is DraftWorkingCopy {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isCatalogType(value.catalogType) &&
    typeof value.sourceVersion === 'number' &&
    Number.isInteger(value.sourceVersion) &&
    value.sourceVersion >= 1 &&
    typeof value.isDirty === 'boolean' &&
    'data' in value &&
    value.data !== undefined
  );
}

function isPersistedDraftRecord(value: unknown): value is PersistedDraftRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaVersion === DRAFT_SCHEMA_VERSION &&
    typeof value.savedAt === 'string' &&
    value.savedAt !== '' &&
    isDraftWorkingCopy(value.draft)
  );
}

export function parsePersistedDraftRecord(
  raw: string,
): PersistedDraftRecord | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedDraftRecord(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function readPersistedDraft(
  catalogType: CatalogType,
  sourceVersion: number,
): PersistedDraftRecord | null {
  const key = draftStorageKey(catalogType, sourceVersion);
  const raw = readStorageItem(key);
  if (raw === null) {
    return null;
  }

  const record = parsePersistedDraftRecord(raw);
  if (
    record === null ||
    record.draft.catalogType !== catalogType ||
    record.draft.sourceVersion !== sourceVersion
  ) {
    removeStorageItem(key);
    return null;
  }

  return record;
}

export function writePersistedDraft<T>(
  workingCopy: DraftWorkingCopy<T>,
): void {
  const record: PersistedDraftRecord<T> = {
    schemaVersion: DRAFT_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    draft: workingCopy,
  };

  writeStorageItem(
    draftStorageKey(workingCopy.catalogType, workingCopy.sourceVersion),
    JSON.stringify(record),
  );
}

export function clearPersistedDraft(
  catalogType: CatalogType,
  sourceVersion: number,
): void {
  removeStorageItem(draftStorageKey(catalogType, sourceVersion));
}

export function clearPersistedDraftsForCatalogType(catalogType: CatalogType): void {
  for (const key of collectDraftStorageKeys()) {
    const parsedKey = parseDraftStorageKey(key);
    if (parsedKey?.catalogType === catalogType) {
      removeStorageItem(key);
    }
  }
}

export function clearAllPersistedDrafts(): void {
  for (const key of collectDraftStorageKeys()) {
    removeStorageItem(key);
  }
}

export function readLatestPersistedDraft(
  catalogType: CatalogType,
): PersistedDraftRecord | null {
  let latest: PersistedDraftRecord | null = null;

  for (const key of collectDraftStorageKeys()) {
    const parsedKey = parseDraftStorageKey(key);
    if (parsedKey?.catalogType !== catalogType) {
      continue;
    }

    const record = readPersistedDraft(parsedKey.catalogType, parsedKey.sourceVersion);
    if (record === null) {
      continue;
    }

    if (latest === null || record.savedAt >= latest.savedAt) {
      latest = record;
    }
  }

  return latest;
}

export function readAllPersistedDrafts(): Partial<
  Record<CatalogType, PersistedDraftRecord>
> {
  const drafts: Partial<Record<CatalogType, PersistedDraftRecord>> = {};

  for (const catalogType of CATALOG_TYPES) {
    const record = readLatestPersistedDraft(catalogType);
    if (record) {
      drafts[catalogType] = record;
    }
  }

  return drafts;
}
