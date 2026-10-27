import { useState } from 'react';
import type { CatalogEntityData, CatalogType } from '../types/catalog';
import {
  applyCatalogImport,
  buildCatalogBundle,
  catalogBundleFilename,
  dirtyDraftsToPublish,
  downloadJson,
  publishChangedCatalogs,
  readTextFile,
  validateCatalogJson,
  type ExportSource,
  type FieldError,
  type PublishTypeResult,
} from '../lib/catalogImport';
import { discardDraft, useDraftStore } from './useDraftCatalog';
import { usePublishCatalog } from './usePublishCatalog';
import { useAccount } from './useAccount';

interface UseCatalogImportExportOptions {
  published: Partial<Record<CatalogType, CatalogEntityData | undefined>>;
  latestVersions: Partial<Record<CatalogType, number | null>>;
}

export function useCatalogImportExport({
  published,
  latestVersions,
}: UseCatalogImportExportOptions) {
  const drafts = useDraftStore();
  const account = useAccount();
  const publishCatalog = usePublishCatalog();
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [publishAllOpen, setPublishAllOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<FieldError[] | null>(null);
  const [importApplied, setImportApplied] = useState<CatalogType[] | null>(null);
  const [publishResults, setPublishResults] = useState<PublishTypeResult[] | null>(null);
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  const pendingPublish = dirtyDraftsToPublish(drafts);

  return {
    importOpen,
    exportOpen,
    publishAllOpen,
    importErrors,
    importApplied,
    publishResults,
    isPublishingAll,
    pendingPublish,
    canPublishAll: account.isAdmin && pendingPublish.length > 0,
    openImport: () => {
      setImportErrors(null);
      setImportApplied(null);
      setImportOpen(true);
    },
    closeImport: () => setImportOpen(false),
    openExport: () => setExportOpen(true),
    closeExport: () => setExportOpen(false),
    openPublishAll: () => {
      if (!account.isAdmin) {
        return;
      }
      setPublishResults(null);
      setPublishAllOpen(true);
    },
    closePublishAll: () => setPublishAllOpen(false),
    handleImportFile: async (file: File) => {
      const result = validateCatalogJson(await readTextFile(file));
      if (!result.ok) {
        setImportApplied(null);
        setImportErrors(result.errors);
        return;
      }
      setImportErrors(null);
      setImportApplied(applyCatalogImport(result.bundle, drafts, latestVersions));
    },
    handleExport: (source: ExportSource) => {
      const bundle = buildCatalogBundle({
        versionTag: 'combat-0.1.0',
        source,
        drafts,
        published,
      });
      downloadJson(catalogBundleFilename(source, bundle.versionTag), bundle);
      setExportOpen(false);
    },
    handlePublishAll: async (releaseNotes: string) => {
      setIsPublishingAll(true);
      const results = await publishChangedCatalogs(
        pendingPublish.map((item) => ({
          ...item,
          releaseNotes: releaseNotes || undefined,
        })),
        (catalogType, request) => publishCatalog.publish({ catalogType, request }),
      );
      results.forEach((result) => {
        if (result.status === 'published') {
          discardDraft(result.catalogType);
        }
      });
      setPublishResults(results);
      setIsPublishingAll(false);
    },
  };
}
