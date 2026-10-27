import { EMPTY_LIST_PUBLISH_MESSAGE } from '../catalogSchema';
import type {
  CatalogEntityData,
  CatalogType,
  PublishCatalogRequest,
  PublishedCatalogResponse,
} from '../../types/catalog';
import type { PublishableDraft, PublishTypeResult } from './types';

export function isEmptyListPublish(catalogType: CatalogType, data: CatalogEntityData): boolean {
  return catalogType !== 'combat-constants' && Array.isArray(data) && data.length === 0;
}

export async function publishChangedCatalogs(
  items: PublishableDraft[],
  publish: (
    catalogType: CatalogType,
    request: PublishCatalogRequest,
  ) => Promise<PublishedCatalogResponse>,
): Promise<PublishTypeResult[]> {
  const results: PublishTypeResult[] = [];

  for (const item of items) {
    if (isEmptyListPublish(item.catalogType, item.data)) {
      results.push({
        catalogType: item.catalogType,
        status: 'skipped',
        message: EMPTY_LIST_PUBLISH_MESSAGE,
      });
      continue;
    }

    try {
      const published = await publish(item.catalogType, {
        data: item.data,
        releaseNotes: item.releaseNotes,
      });
      results.push({
        catalogType: item.catalogType,
        status: 'published',
        version: published.version,
      });
    } catch (error) {
      results.push({
        catalogType: item.catalogType,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Publish failed',
      });
    }
  }

  return results;
}

export function dirtyDraftsToPublish(
  drafts: Partial<Record<CatalogType, { isDirty: boolean; data: CatalogEntityData } | null>>,
): PublishableDraft[] {
  const items: PublishableDraft[] = [];
  (Object.keys(drafts) as CatalogType[]).forEach((catalogType) => {
    const draft = drafts[catalogType];
    if (draft?.isDirty) {
      items.push({ catalogType, data: draft.data });
    }
  });
  return items;
}
