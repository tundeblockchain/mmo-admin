import { apiClient } from './client';
import { getIdToken } from '../auth';
import type {
  CatalogType,
  CatalogVersionList,
  ClassCatalogData,
  SkillCatalogData,
  StatusCatalogData,
  ElementCatalogData,
  ResonanceCatalogData,
  CombatConstantsCatalogData,
  PublishCatalogRequest,
  PublishedCatalogResponse,
} from '../types/catalog';

export async function fetchCatalogVersions(): Promise<CatalogVersionList> {
  const response = await apiClient.get<CatalogVersionList>('/catalog/versions');
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

export async function publishCatalog(
  catalogType: CatalogType,
  request: PublishCatalogRequest,
): Promise<PublishedCatalogResponse> {
  const idToken = await getIdToken();
  if (!idToken) {
    throw new Error('Authentication required to publish catalog');
  }

  const response = await apiClient.post<PublishedCatalogResponse>(
    `/catalog/${catalogType}/versions`,
    request,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );
  return response.data;
}
