import type { CatalogEntityData } from '../types/catalog';
import type {
  CatalogEntriesSnapshot,
  CatalogReadiness,
  ListCatalogType,
} from './catalogDependents';

export interface PublishedCatalogSource<T> {
  entries: T[] | undefined;
  ready: boolean;
}

export type PublishedCatalogSources = {
  [Type in ListCatalogType]: PublishedCatalogSource<NonNullable<CatalogEntriesSnapshot[Type]>[number]>;
};

export interface DraftCatalogSources {
  class?: { data: CatalogEntityData } | null;
  skill?: { data: CatalogEntityData } | null;
  status?: { data: CatalogEntityData } | null;
  element?: { data: CatalogEntityData } | null;
  resonance?: { data: CatalogEntityData } | null;
}

export function publishedListSource<T>(
  latestLoaded: boolean,
  version: number | null,
  query: { isPending: boolean; isError: boolean; data?: { data: T[] } },
): PublishedCatalogSource<T> {
  if (!latestLoaded) {
    return { entries: undefined, ready: false };
  }

  if (version === null) {
    return { entries: [], ready: true };
  }

  if (query.isPending || query.isError) {
    return { entries: undefined, ready: false };
  }

  return { entries: query.data?.data ?? [], ready: true };
}

export function mergeCatalogSource<T>(
  draftData: CatalogEntityData | undefined,
  published: PublishedCatalogSource<T>,
): PublishedCatalogSource<T> {
  if (Array.isArray(draftData)) {
    return { entries: draftData as T[], ready: true };
  }

  return published;
}

export function mergeDraftAndPublished(
  drafts: DraftCatalogSources,
  published: PublishedCatalogSources,
): { snapshot: CatalogEntriesSnapshot; ready: CatalogReadiness } {
  const classSource = mergeCatalogSource(drafts.class?.data, published.class);
  const skillSource = mergeCatalogSource(drafts.skill?.data, published.skill);
  const statusSource = mergeCatalogSource(drafts.status?.data, published.status);
  const elementSource = mergeCatalogSource(drafts.element?.data, published.element);
  const resonanceSource = mergeCatalogSource(drafts.resonance?.data, published.resonance);

  return {
    snapshot: {
      class: classSource.entries,
      skill: skillSource.entries,
      status: statusSource.entries,
      element: elementSource.entries,
      resonance: resonanceSource.entries,
    },
    ready: {
      class: classSource.ready,
      skill: skillSource.ready,
      status: statusSource.ready,
      element: elementSource.ready,
      resonance: resonanceSource.ready,
    },
  };
}

export function draftListLength(data: CatalogEntityData | undefined): number {
  return Array.isArray(data) ? data.length : 0;
}
