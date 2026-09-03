import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchClassCatalog,
  fetchSkillCatalog,
  fetchStatusCatalog,
  fetchElementCatalog,
  fetchResonanceCatalog,
  fetchCombatConstantsCatalog,
} from '../api/catalog';
import { queryKeys } from './queryKeys';
import type {
  ClassCatalogData,
  SkillCatalogData,
  StatusCatalogData,
  ElementCatalogData,
  ResonanceCatalogData,
  CombatConstantsCatalogData,
} from '../types/catalog';

export function useClassCatalog(version: number | null): UseQueryResult<ClassCatalogData> {
  return useQuery({
    queryKey: queryKeys.catalog.data('class', version ?? 0),
    queryFn: () => fetchClassCatalog(version!),
    enabled: version !== null,
    staleTime: Infinity,
  });
}

export function useSkillCatalog(version: number | null): UseQueryResult<SkillCatalogData> {
  return useQuery({
    queryKey: queryKeys.catalog.data('skill', version ?? 0),
    queryFn: () => fetchSkillCatalog(version!),
    enabled: version !== null,
    staleTime: Infinity,
  });
}

export function useStatusCatalog(version: number | null): UseQueryResult<StatusCatalogData> {
  return useQuery({
    queryKey: queryKeys.catalog.data('status', version ?? 0),
    queryFn: () => fetchStatusCatalog(version!),
    enabled: version !== null,
    staleTime: Infinity,
  });
}

export function useElementCatalog(version: number | null): UseQueryResult<ElementCatalogData> {
  return useQuery({
    queryKey: queryKeys.catalog.data('element', version ?? 0),
    queryFn: () => fetchElementCatalog(version!),
    enabled: version !== null,
    staleTime: Infinity,
  });
}

export function useResonanceCatalog(version: number | null): UseQueryResult<ResonanceCatalogData> {
  return useQuery({
    queryKey: queryKeys.catalog.data('resonance', version ?? 0),
    queryFn: () => fetchResonanceCatalog(version!),
    enabled: version !== null,
    staleTime: Infinity,
  });
}

export function useCombatConstantsCatalog(version: number | null): UseQueryResult<CombatConstantsCatalogData> {
  return useQuery({
    queryKey: queryKeys.catalog.data('combat-constants', version ?? 0),
    queryFn: () => fetchCombatConstantsCatalog(version!),
    enabled: version !== null,
    staleTime: Infinity,
  });
}
