import type { CatalogType, CatalogVersionSummary, LatestVersions } from '../types/catalog';

export const UNPUBLISHED_SOURCE_VERSION = 0;

export function isPublishedVersion(version: number | null): version is number {
  return version !== null && version > UNPUBLISHED_SOURCE_VERSION;
}

export function publishedVersionOrNull(version: number | null): number | null {
  return isPublishedVersion(version) ? version : null;
}

export function latestPublishedVersion(
  versions: CatalogVersionSummary[],
  catalogType: CatalogType,
): number | null {
  let latest: number | null = null;

  for (const version of versions) {
    if (version.catalogType !== catalogType) {
      continue;
    }

    if (latest === null || version.version > latest) {
      latest = version.version;
    }
  }

  return latest;
}

export function latestVersionFromMap(
  latest: LatestVersions | undefined,
  catalogType: CatalogType,
): number | null {
  const value = latest?.versions[catalogType];
  return typeof value === 'number' ? value : null;
}
