import type { CatalogType } from '../types/catalog';

export const queryKeys = {
  catalog: {
    all: ['catalog'] as const,
    versions: () => [...queryKeys.catalog.all, 'versions'] as const,
    latestVersions: () => [...queryKeys.catalog.all, 'latest'] as const,
    data: (catalogType: CatalogType, version: number) =>
      [...queryKeys.catalog.all, catalogType, version] as const,
  },
} as const;
