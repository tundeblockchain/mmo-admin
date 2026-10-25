import { useQuery } from '@tanstack/react-query';
import {
  fetchClassCatalog,
  fetchElementCatalog,
  fetchResonanceCatalog,
  fetchSkillCatalog,
  fetchStatusCatalog,
} from '../api/catalog';
import {
  catalogEntities,
  mergeCatalogOptions,
  type CatalogOption,
  type CatalogReferenceType,
} from '../lib/catalogOptions';
import type { AnyCatalogData } from '../types/catalog';
import { queryKeys } from './queryKeys';
import { useDraft } from './useDraftCatalog';
import { useLatestCatalogVersions } from './useLatestCatalogVersions';

export interface CatalogOptionsResult {
  options: CatalogOption[];
  isLoading: boolean;
  isEmpty: boolean;
}

function fetchPublishedCatalog(
  catalogType: CatalogReferenceType,
  version: number,
): Promise<AnyCatalogData> {
  switch (catalogType) {
    case 'class':
      return fetchClassCatalog(version);
    case 'skill':
      return fetchSkillCatalog(version);
    case 'status':
      return fetchStatusCatalog(version);
    case 'element':
      return fetchElementCatalog(version);
    case 'resonance':
      return fetchResonanceCatalog(version);
  }
}

function publishedEntities(data: AnyCatalogData | undefined): unknown[] {
  if (!data || data.catalogType === 'combat-constants' || !Array.isArray(data.data)) {
    return [];
  }
  return data.data;
}

export function useCatalogOptions(catalogType: CatalogReferenceType): CatalogOptionsResult {
  const latest = useLatestCatalogVersions();
  const version = latest.data?.versions[catalogType] ?? null;
  const published = useQuery({
    queryKey: queryKeys.catalog.data(catalogType, version ?? 0),
    queryFn: () => {
      if (version === null) {
        throw new Error('Published catalog version is required');
      }
      return fetchPublishedCatalog(catalogType, version);
    },
    enabled: version !== null,
    staleTime: Infinity,
  });
  const draft = useDraft(catalogType);
  const options = mergeCatalogOptions(
    catalogType,
    publishedEntities(published.data),
    catalogEntities(draft?.data),
  );
  const isLoading = latest.isPending || (version !== null && published.isPending);

  return {
    options,
    isLoading,
    isEmpty: !isLoading && options.length === 0,
  };
}
