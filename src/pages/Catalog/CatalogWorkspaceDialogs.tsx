import { Alert, Snackbar } from '@mui/material';
import { AddEntryDialog } from '../../components/catalog/addEntry/AddEntryDialog';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DeleteEntryDialog } from '../../components/catalog/DeleteEntryDialog';
import { ExportDialog } from '../../components/catalog/importExport/ExportDialog';
import { ImportDialog } from '../../components/catalog/importExport/ImportDialog';
import { PublishAllDialog } from '../../components/catalog/importExport/PublishAllDialog';
import { PublishDialog } from '../../components/catalog/PublishDialog';
import type { useCatalogImportExport } from '../../hooks/useCatalogImportExport';
import { CATALOG_TYPES } from '../../lib/draftKeys';
import type { CatalogWorkspace } from './panelShared';

interface CatalogWorkspaceDialogsProps {
  workspace: CatalogWorkspace;
  importExport: ReturnType<typeof useCatalogImportExport>;
}

export function CatalogWorkspaceDialogs({
  workspace,
  importExport,
}: CatalogWorkspaceDialogsProps) {
  const hasDraft = CATALOG_TYPES.some((type) => workspace.drafts[type] !== null);
  const hasPublished = CATALOG_TYPES.some(
    (type) => workspace.catalogQueryData[type] !== undefined,
  );

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

      <ImportDialog
        open={importExport.importOpen}
        errors={importExport.importErrors}
        appliedTypes={importExport.importApplied}
        onClose={importExport.closeImport}
        onFile={importExport.handleImportFile}
      />

      <ExportDialog
        open={importExport.exportOpen}
        hasDraft={hasDraft}
        hasPublished={hasPublished}
        onClose={importExport.closeExport}
        onExport={importExport.handleExport}
      />

      <PublishAllDialog
        open={importExport.publishAllOpen}
        items={importExport.pendingPublish}
        results={importExport.publishResults}
        isPending={importExport.isPublishingAll}
        onClose={importExport.closePublishAll}
        onPublish={importExport.handlePublishAll}
      />

      {workspace.pendingDelete && workspace.deleteEvaluation && (
        <DeleteEntryDialog
          pending={workspace.pendingDelete}
          evaluation={workspace.deleteEvaluation}
          onClose={workspace.handleCancelDelete}
          onConfirm={workspace.handleConfirmDelete}
        />
      )}

      {workspace.discardConfirmOpen && (
        <ConfirmDialog
          open
          title="Discard draft?"
          description="Discard this draft and revert to the published source version? Unsaved changes will be removed from this browser."
          confirmLabel="Discard"
          confirmColor="error"
          onClose={workspace.handleCancelDiscard}
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
