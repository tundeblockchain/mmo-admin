import { Alert, Box, Paper, Snackbar, Typography } from '@mui/material';
import { CatalogTypeNav } from '../../components/catalog/CatalogTypeNav';
import { ConfirmDeleteDialog } from '../../components/catalog/ConfirmDeleteDialog';
import { DraftToolbar } from '../../components/catalog/DraftToolbar';
import { PublishDialog } from '../../components/catalog/PublishDialog';
import { StaleDraftWarning } from '../../components/catalog/StaleDraftWarning';
import { VersionPicker } from '../../components/catalog/VersionPicker';
import { CatalogTypeContent } from './CatalogTypeContent';
import { useCatalogWorkspace } from './useCatalogWorkspace';

export function CatalogPage() {
  const workspace = useCatalogWorkspace();

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Catalog
      </Typography>

      <CatalogTypeNav
        selectedType={workspace.selectedType}
        onTypeChange={workspace.handleTypeChange}
      />

      <Box sx={{ mb: 3 }}>
        <VersionPicker
          catalogType={workspace.selectedType}
          versions={workspace.allVersions}
          selectedVersion={workspace.currentVersion}
          onVersionChange={(version) =>
            workspace.handleVersionChange(workspace.selectedType, version)
          }
          isLoading={workspace.versionsLoading}
          error={workspace.versionsError}
          disabled={workspace.draft !== null}
        />
        {workspace.currentVersion !== null && !workspace.draft && (
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

      {workspace.currentVersion !== null && (
        <DraftToolbar
          catalogType={workspace.selectedType}
          currentVersion={workspace.currentVersion}
          hasDraft={workspace.draft !== null}
          isDraftDirty={workspace.draft?.isDirty ?? false}
          draftSourceVersion={workspace.draft?.sourceVersion ?? null}
          onCreateDraft={workspace.handleCreateDraft}
          onDiscardDraft={workspace.handleRequestDiscard}
          onOpenPublish={workspace.handleOpenPublish}
          isCreatingDraft={false}
          hasValidationErrors={workspace.hasValidationErrors}
        />
      )}

      {workspace.currentVersion === null ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Select a version above to browse catalog entities.
          </Typography>
        </Paper>
      ) : (
        <CatalogTypeContent workspace={workspace} />
      )}

      {workspace.draft && workspace.originalData && (
        <PublishDialog
          open={workspace.publishDialogOpen}
          onClose={workspace.handleClosePublish}
          onPublish={workspace.handlePublish}
          catalogType={workspace.selectedType}
          sourceVersion={workspace.draft.sourceVersion}
          originalData={workspace.originalData}
          draftData={workspace.draft.data}
          isPending={workspace.publishCatalog.isPending}
          error={workspace.publishCatalog.error}
          isConflictError={workspace.publishCatalog.isConflictError}
          isAuthError={workspace.publishCatalog.isAuthError}
          isForbiddenError={workspace.publishCatalog.isForbiddenError}
          isBadRequestError={workspace.publishCatalog.isBadRequestError}
          hasValidationErrors={workspace.hasValidationErrors}
        />
      )}

      {workspace.pendingDelete && (
        <ConfirmDeleteDialog
          open
          title={`Delete ${workspace.pendingDelete.kindLabel}?`}
          description={`Delete "${workspace.pendingDelete.displayName || 'this entry'}" from this draft? This only affects the working copy.`}
          onCancel={workspace.handleCancelDelete}
          onConfirm={workspace.handleConfirmDelete}
        />
      )}

      {workspace.discardConfirmOpen && (
        <ConfirmDeleteDialog
          open
          title="Discard draft?"
          description="Discard this draft and revert to the published source version? Unsaved changes will be removed from this browser."
          confirmLabel="Discard"
          onCancel={workspace.handleCancelDiscard}
          onConfirm={workspace.handleConfirmDiscard}
        />
      )}

      <Snackbar
        open={workspace.successSnackbar !== null}
        autoHideDuration={6000}
        onClose={workspace.handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={workspace.handleCloseSnackbar} severity="success" variant="filled">
          {workspace.successSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
