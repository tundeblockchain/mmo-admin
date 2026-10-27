import type { CatalogEntityData, CatalogType } from '../../types/catalog';
import { CATALOG_TYPES } from '../draftKeys';
import { UNPUBLISHED_SOURCE_VERSION } from '../catalogVersions';
import { createDraft, updateDraft, type DraftStore } from '../../hooks/draftStore';
import type { CatalogBundle } from './types';

export function applyCatalogImport(
  bundle: CatalogBundle,
  drafts: DraftStore,
  latestVersions: Partial<Record<CatalogType, number | null>>,
): CatalogType[] {
  const applied: CatalogType[] = [];

  for (const catalogType of CATALOG_TYPES) {
    const data = bundle[catalogType];
    if (data === undefined) {
      continue;
    }

    const existing = drafts[catalogType];
    const sourceVersion =
      existing?.sourceVersion ?? latestVersions[catalogType] ?? UNPUBLISHED_SOURCE_VERSION;
    if (!existing) {
      createDraft(catalogType, sourceVersion, data as CatalogEntityData);
    }
    updateDraft(catalogType, data as CatalogEntityData);
    applied.push(catalogType);
  }

  return applied;
}
