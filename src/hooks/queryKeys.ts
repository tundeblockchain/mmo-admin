import type { CatalogType } from '../types/catalog';

export const queryKeys = {
  catalog: {
    all: ['catalog'] as const,
    versions: () => [...queryKeys.catalog.all, 'versions'] as const,
    latest: () => [...queryKeys.catalog.all, 'latest'] as const,
    data: (catalogType: CatalogType, version: number) =>
      [...queryKeys.catalog.all, catalogType, version] as const,
  },
  account: {
    all: ['account'] as const,
    me: (uid: string) => [...queryKeys.account.all, 'me', uid] as const,
  },
} as const;
