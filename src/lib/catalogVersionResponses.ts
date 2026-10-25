import type { CatalogVersionList, CatalogVersionSummary, LatestVersions } from '../types/catalog';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeCatalogVersionList(data: unknown): CatalogVersionList {
  if (Array.isArray(data)) {
    return { versions: data as CatalogVersionSummary[] };
  }

  if (isRecord(data) && Array.isArray(data.versions)) {
    return { versions: data.versions as CatalogVersionSummary[] };
  }

  return { versions: [] };
}

export function normalizeLatestVersions(data: unknown): LatestVersions {
  if (!isRecord(data) || !isRecord(data.versions)) {
    return { versions: {}, timestamp: '' };
  }

  const timestamp = typeof data.timestamp === 'string' ? data.timestamp : '';
  return {
    versions: data.versions as LatestVersions['versions'],
    timestamp,
  };
}
