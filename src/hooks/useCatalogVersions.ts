import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchCatalogVersions } from '../api/catalog';
import { queryKeys } from './queryKeys';
import type { CatalogVersionList } from '../types/catalog';

export function useCatalogVersions(): UseQueryResult<CatalogVersionList> {
  return useQuery({
    queryKey: queryKeys.catalog.versions(),
    queryFn: fetchCatalogVersions,
    staleTime: 5 * 60 * 1000,
  });
}
