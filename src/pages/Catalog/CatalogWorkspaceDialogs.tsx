import { Alert, Snackbar } from '@mui/material';
import { AddEntryDialog } from '../../components/catalog/addEntry/AddEntryDialog';
import { ConfirmDeleteDialog } from '../../components/catalog/ConfirmDeleteDialog';
import { PublishDialog } from '../../components/catalog/PublishDialog';
import type { CatalogWorkspace } from './panelShared';

export function CatalogWorkspaceDialogs({ workspace }: { workspace: CatalogWorkspace }) {
  return (
    <>
      <AddEntryDialog
        open={workspace.addDialogOpen}
        catalogType={workspace.selectedType}
        existingIds={workspace.existingIds}
        onClose={workspace.handleCloseAdd}
        onSubmit={workspace.draftActions.handleAddEntity}
      />

      {workspace.draft && (
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
    </>
  );
}
