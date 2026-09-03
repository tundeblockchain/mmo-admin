import { apiClient } from './client';
import type {
  CatalogVersionList,
  LatestVersions,
  ClassCatalogData,
  SkillCatalogData,
  StatusCatalogData,
  ElementCatalogData,
  ResonanceCatalogData,
  CombatConstantsCatalogData,
} from '../types/catalog';

export async function fetchCatalogVersions(): Promise<CatalogVersionList> {
  const response = await apiClient.get<CatalogVersionList>('/catalog/versions');
  return response.data;
}

export async function fetchLatestVersions(): Promise<LatestVersions> {
  const response = await apiClient.get<LatestVersions>('/catalog/versions/latest');
  return response.data;
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
