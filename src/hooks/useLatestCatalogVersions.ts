import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchLatestCatalogVersions } from '../api/catalog';
import { queryKeys } from './queryKeys';
import type { LatestVersions } from '../types/catalog';

export function useLatestCatalogVersions(): UseQueryResult<LatestVersions> {
  return useQuery({
    queryKey: queryKeys.catalog.latest(),
    queryFn: fetchLatestCatalogVersions,
    staleTime: 5 * 60 * 1000,
  });
}
