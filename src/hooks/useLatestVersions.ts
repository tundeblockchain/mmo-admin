import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchLatestVersions } from '../api/catalog';
import { queryKeys } from './queryKeys';
import type { LatestVersions } from '../types/catalog';

export function useLatestVersions(): UseQueryResult<LatestVersions> {
  return useQuery({
    queryKey: queryKeys.catalog.latestVersions(),
    queryFn: fetchLatestVersions,
    staleTime: 5 * 60 * 1000,
  });
}
