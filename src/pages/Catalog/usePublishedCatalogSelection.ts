import { useCallback, useState } from 'react';
import { useCatalogVersions } from '../../hooks/useCatalogVersions';
import { useLatestCatalogVersions } from '../../hooks/useLatestCatalogVersions';
import {
  latestPublishedVersion,
  latestVersionFromMap,
} from '../../lib/catalogVersions';
import type { CatalogType } from '../../types/catalog';
import {
  emptyVersionSelections,
  resolveVersionSelections,
  type VersionSelections,
} from './catalogPageUtils';

export function usePublishedCatalogSelection() {
  const versionsQuery = useCatalogVersions();
  const latestQuery = useLatestCatalogVersions();
  const [overrides, setOverrides] = useState<VersionSelections>(emptyVersionSelections);
  const allVersions = versionsQuery.data?.versions ?? [];
  const selections = resolveVersionSelections(overrides, allVersions, latestQuery.data);

  const latestFor = (catalogType: CatalogType) =>
    latestPublishedVersion(allVersions, catalogType) ??
    latestVersionFromMap(latestQuery.data, catalogType);

  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    setOverrides((prev) => ({ ...prev, [type]: version }));
  }, []);

  return {
    allVersions,
    selections,
    versionsQuery,
    latestQuery,
    versionsLoading: versionsQuery.isPending,
    versionsError: versionsQuery.error,
    versionData: versionsQuery.data,
    latestFor,
    hasPublishedVersion: (catalogType: CatalogType) => latestFor(catalogType) !== null,
    showEmptyCatalog: (catalogType: CatalogType) =>
      !versionsQuery.isPending &&
      versionsQuery.error == null &&
      latestFor(catalogType) === null,
    handleVersionChange,
    setOverrides,
  };
}
