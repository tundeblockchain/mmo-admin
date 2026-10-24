import type { CatalogType } from '../types/catalog';
import {
  CATALOG_TYPES,
  DRAFT_SCHEMA_VERSION,
  draftStorageKey,
  isCatalogType,
} from './draftKeys';
import {
  collectDraftStorageKeys,
  parseDraftStorageKey,
  readStorageItem,
  removeStorageItem,
  writeStorageItem,
} from './draftStorage';

export { CATALOG_TYPES, DRAFT_SCHEMA_VERSION, DRAFT_STORAGE_PREFIX, draftStorageKey, isCatalogType } from './draftKeys';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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

export function parsePersistedDraftRecord(raw: string): PersistedDraftRecord | null {
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

export function writePersistedDraft<T>(workingCopy: DraftWorkingCopy<T>): void {
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

export function clearPersistedDraft(catalogType: CatalogType, sourceVersion: number): void {
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

export function readLatestPersistedDraft(catalogType: CatalogType): PersistedDraftRecord | null {
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

export function readAllPersistedDrafts(): Partial<Record<CatalogType, PersistedDraftRecord>> {
  const drafts: Partial<Record<CatalogType, PersistedDraftRecord>> = {};

  for (const catalogType of CATALOG_TYPES) {
    const record = readLatestPersistedDraft(catalogType);
    if (record) {
      drafts[catalogType] = record;
    }
  }

  return drafts;
}
