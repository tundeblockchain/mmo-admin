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

export function draftStorageKey(catalogType: CatalogType, sourceVersion: number): string {
  return `${DRAFT_STORAGE_PREFIX}${catalogType}:${sourceVersion}`;
}

export function isCatalogType(value: unknown): value is CatalogType {
  return typeof value === 'string' && (CATALOG_TYPES as readonly string[]).includes(value);
}
