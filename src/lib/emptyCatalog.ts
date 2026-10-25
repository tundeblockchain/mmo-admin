import type { CatalogEntityData, CatalogType, CombatConstantsData } from '../types/catalog';
import { createDefaultCombatConstants } from './catalogDefaults';

export function emptyOriginalData(catalogType: CatalogType): CatalogEntityData {
  if (catalogType === 'combat-constants') {
    return {} as CombatConstantsData;
  }
  return [];
}

export function emptyDraftSeed(catalogType: CatalogType): CatalogEntityData {
  if (catalogType === 'combat-constants') {
    return createDefaultCombatConstants();
  }
  return [];
}

export function catalogHasPublishedVersion(
  latestForType: number | null,
  versionsForTypeCount: number,
): boolean {
  return latestForType !== null || versionsForTypeCount > 0;
}
