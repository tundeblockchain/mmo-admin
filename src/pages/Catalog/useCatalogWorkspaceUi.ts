import { useState } from 'react';
import type { CatalogType } from '../../types/catalog';
import type { PendingDelete } from './catalogPageUtils';

export function useCatalogWorkspaceUi() {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState<string | null>(null);
  const [dismissedRestoreNoticeId, setDismissedRestoreNoticeId] = useState<string | null>(null);
  const [dismissedStaleWarningId, setDismissedStaleWarningId] = useState<string | null>(null);

  return {
    pendingDelete,
    setPendingDelete,
    discardConfirmOpen,
    setDiscardConfirmOpen,
    publishDialogOpen,
    setPublishDialogOpen,
    addDialogOpen,
    setAddDialogOpen,
    successSnackbar,
    setSuccessSnackbar,
    dismissedRestoreNoticeId,
    setDismissedRestoreNoticeId,
    dismissedStaleWarningId,
    setDismissedStaleWarningId,
    handleRequestDiscard: () => setDiscardConfirmOpen(true),
    handleCancelDiscard: () => setDiscardConfirmOpen(false),
    handleCloseSnackbar: () => setSuccessSnackbar(null),
    handleCancelDelete: () => setPendingDelete(null),
  };
}

export function draftNoticeFlags(args: {
  draft: { catalogType: CatalogType; sourceVersion: number; wasRestored?: boolean } | null;
  latestVersion: number | null;
  dismissedRestoreNoticeId: string | null;
  dismissedStaleWarningId: string | null;
}) {
  const draftIdentity = args.draft
    ? `${args.draft.catalogType}:${args.draft.sourceVersion}`
    : null;
  return {
    draftIdentity,
    showRestoreNotice:
      args.draft?.wasRestored === true && draftIdentity !== args.dismissedRestoreNoticeId,
    showStaleBaseWarning:
      args.draft !== null &&
      args.latestVersion !== null &&
      args.draft.sourceVersion !== args.latestVersion &&
      draftIdentity !== args.dismissedStaleWarningId,
  };
}
