import type { CatalogType, CatalogVersionSummary } from '../types/catalog';

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
