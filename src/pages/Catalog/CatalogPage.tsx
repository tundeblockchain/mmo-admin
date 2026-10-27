import { Alert, Box, Typography } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { AccountNotice } from '../../components/account/AccountNotice';
import { CatalogEmptyState } from '../../components/catalog/addEntry/CatalogEmptyState';
import { ImportExportToolbar } from '../../components/catalog/importExport/ImportExportToolbar';
import { DraftToolbar } from '../../components/catalog/DraftToolbar';
import { StaleDraftWarning } from '../../components/catalog/StaleDraftWarning';
import { VersionPicker } from '../../components/catalog/VersionPicker';
import { useCatalogImportExport } from '../../hooks/useCatalogImportExport';
import {
  CATALOG_DEFAULT_PATH,
  catalogLabelForType,
  isUnknownCatalogSection,
} from '../../lib/catalogRoutes';
import { isPublishedVersion } from '../../lib/catalogVersions';
import { CatalogTypeContent } from './CatalogTypeContent';
import { CatalogWorkspaceDialogs } from './CatalogWorkspaceDialogs';
import { useCatalogWorkspace } from './useCatalogWorkspace';

export function CatalogPage() {
  const { catalogSection } = useParams<{ catalogSection: string }>();
  if (isUnknownCatalogSection(catalogSection)) {
    return <Navigate to={CATALOG_DEFAULT_PATH} replace />;
  }

  return <CatalogWorkspacePage />;
}

function CatalogWorkspacePage() {
  const workspace = useCatalogWorkspace();
  const importExport = useCatalogImportExport({
    published: workspace.catalogQueryData,
    latestVersions: workspace.latestByType,
  });
  const showToolbar = workspace.draft !== null || isPublishedVersion(workspace.currentVersion);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {catalogLabelForType(workspace.selectedType)}
      </Typography>

      <AccountNotice />

      <ImportExportToolbar
        canPublishAll={importExport.canPublishAll}
        dirtyCount={importExport.pendingPublish.length}
        onImport={importExport.openImport}
        onExport={importExport.openExport}
        onPublishAll={importExport.openPublishAll}
      />

      <Box sx={{ mb: 3 }}>
        <VersionPicker
          catalogType={workspace.selectedType}
          versions={workspace.allVersions}
          selectedVersion={workspace.publishedSelection}
          onVersionChange={(version) =>
            workspace.handleVersionChange(workspace.selectedType, version)
          }
          isLoading={workspace.versionsLoading}
          error={workspace.versionsError}
          disabled={workspace.draft !== null}
        />
        {isPublishedVersion(workspace.currentVersion) && !workspace.draft && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            Viewing version {workspace.currentVersion}
          </Typography>
        )}
      </Box>

      {workspace.showRestoreNotice && (
        <Alert
          severity="info"
          role="status"
          aria-label="Restored unsaved draft"
          sx={{ mb: 2 }}
          onClose={workspace.dismissRestoreNotice}
        >
          Restored unsaved draft
        </Alert>
      )}

      {workspace.showStaleBaseWarning && workspace.draft && workspace.latestVersion !== null && (
        <StaleDraftWarning
          sourceVersion={workspace.draft.sourceVersion}
          latestVersion={workspace.latestVersion}
          onKeepEditing={workspace.dismissStaleWarning}
          onDiscard={workspace.handleRequestDiscard}
        />
      )}

      {showToolbar && (
        <DraftToolbar
          catalogType={workspace.selectedType}
          currentVersion={workspace.publishedSelection}
          hasDraft={workspace.draft !== null}
          isDraftDirty={workspace.draft?.isDirty ?? false}
          draftSourceVersion={workspace.draft?.sourceVersion ?? null}
          onCreateDraft={workspace.handleCreateDraft}
          onDiscardDraft={workspace.handleRequestDiscard}
          onOpenPublish={workspace.handleOpenPublish}
          isCreatingDraft={false}
          hasValidationErrors={workspace.hasValidationErrors}
          canPublish={workspace.canPublish}
        />
      )}

      {workspace.showEmptyCatalog ? (
        <CatalogEmptyState
          catalogType={workspace.selectedType}
          onAdd={workspace.handleRequestAdd}
        />
      ) : (
        <CatalogTypeContent workspace={workspace} />
      )}

      <CatalogWorkspaceDialogs workspace={workspace} importExport={importExport} />
    </Box>
  );
}
