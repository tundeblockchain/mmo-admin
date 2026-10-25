import { apiClient } from './client';
import {
  normalizeCatalogVersionList,
  normalizeLatestVersions,
} from '../lib/catalogVersionResponses';
import type {
  CatalogType,
  CatalogVersionList,
  ClassCatalogData,
  SkillCatalogData,
  StatusCatalogData,
  ElementCatalogData,
  ResonanceCatalogData,
  CombatConstantsCatalogData,
  LatestVersions,
  PublishCatalogRequest,
  PublishedCatalogResponse,
} from '../types/catalog';

export async function fetchCatalogVersions(): Promise<CatalogVersionList> {
  const response = await apiClient.get<unknown>('/catalog/versions');
  return normalizeCatalogVersionList(response.data);
}

export async function fetchLatestCatalogVersions(): Promise<LatestVersions> {
  const response = await apiClient.get<unknown>('/catalog/versions/latest');
  return normalizeLatestVersions(response.data);
}

export async function fetchClassCatalog(version: number): Promise<ClassCatalogData> {
  const response = await apiClient.get<ClassCatalogData>(`/catalog/class/v/${version}`);
  return response.data;
}

export async function fetchSkillCatalog(version: number): Promise<SkillCatalogData> {
  const response = await apiClient.get<SkillCatalogData>(`/catalog/skill/v/${version}`);
  return response.data;
}

export async function fetchStatusCatalog(version: number): Promise<StatusCatalogData> {
  const response = await apiClient.get<StatusCatalogData>(`/catalog/status/v/${version}`);
  return response.data;
}

export async function fetchElementCatalog(version: number): Promise<ElementCatalogData> {
  const response = await apiClient.get<ElementCatalogData>(`/catalog/element/v/${version}`);
  return response.data;
}

export async function fetchResonanceCatalog(version: number): Promise<ResonanceCatalogData> {
  const response = await apiClient.get<ResonanceCatalogData>(`/catalog/resonance/v/${version}`);
  return response.data;
}

export async function fetchCombatConstantsCatalog(version: number): Promise<CombatConstantsCatalogData> {
  const response = await apiClient.get<CombatConstantsCatalogData>(`/catalog/combat-constants/v/${version}`);
  return response.data;
}

export async function publishCatalog(
  catalogType: CatalogType,
  request: PublishCatalogRequest,
): Promise<PublishedCatalogResponse> {
  const response = await apiClient.post<PublishedCatalogResponse>(
    `/catalog/${catalogType}/versions`,
    request,
  );
  return response.data;
}
