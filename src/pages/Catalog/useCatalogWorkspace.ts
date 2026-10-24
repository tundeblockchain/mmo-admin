import { useCallback, useState } from 'react';
import { useCatalogVersions } from '../../hooks/useCatalogVersions';
import {
  restorePersistedDraft,
  useCreateDraft,
  useDiscardDraft,
  useDraftStore,
} from '../../hooks/useDraftCatalog';
import { useCatalogDraftActions } from '../../hooks/useCatalogDraftActions';
import { useAccount } from '../../hooks/useAccount';
import { usePublishCatalog } from '../../hooks/usePublishCatalog';
import { latestPublishedVersion } from '../../lib/catalogVersions';
import { entityKindLabel } from '../../lib/catalogLabels';
import { draftHasValidationErrors } from '../../lib/catalogValidation';
import type { CatalogType } from '../../types/catalog';
import { emptyVersionSelections, type VersionSelections } from './catalogPageUtils';
import { useCatalogQueries } from './useCatalogQueries';
import { draftNoticeFlags, useCatalogWorkspaceUi } from './useCatalogWorkspaceUi';

export function useCatalogWorkspace() {
  const [selectedType, setSelectedType] = useState<CatalogType>('class');
  const [versions, setVersions] = useState<VersionSelections>(emptyVersionSelections);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const ui = useCatalogWorkspaceUi();

  const {
    data: versionData,
    isPending: versionsLoading,
    error: versionsError,
  } = useCatalogVersions();

  const drafts = useDraftStore();
  const draft = drafts[selectedType];
  const createDraft = useCreateDraft();
  const discardDraft = useDiscardDraft();
  const queries = useCatalogQueries(drafts, versions);
  const publishCatalog = usePublishCatalog();
  const account = useAccount();
  const draftActions = useCatalogDraftActions({
    draft,
    selectedType,
    selectedIndex,
    setSelectedEntityId,
    setSelectedIndex,
  });

  const handleTypeChange = useCallback((type: CatalogType) => {
    setSelectedType(type);
    setSelectedEntityId(null);
    setSelectedIndex(null);
    ui.setPendingDelete(null);
  }, [ui]);

  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    setVersions((prev) => ({ ...prev, [type]: version }));
    setSelectedEntityId(null);
    setSelectedIndex(null);
    restorePersistedDraft(type, version);
  }, []);

  const handleSelectEntity = useCallback((id: string, index: number) => {
    setSelectedEntityId(id);
    setSelectedIndex(index);
  }, []);

  const handleCreateDraft = useCallback(() => {
    const currentVersion = versions[selectedType];
    const data = queries.originalDataFor(selectedType);
    if (currentVersion === null || !data) return;
    createDraft(selectedType, currentVersion, data);
  }, [selectedType, versions, queries, createDraft]);

  const handleConfirmDiscard = useCallback(() => {
    if (draft && versions[selectedType] === null) {
      setVersions((prev) => ({ ...prev, [selectedType]: draft.sourceVersion }));
    }
    discardDraft(selectedType);
    setSelectedEntityId(null);
    setSelectedIndex(null);
    ui.setPendingDelete(null);
    ui.setDiscardConfirmOpen(false);
  }, [draft, selectedType, versions, discardDraft, ui]);

  const handlePublish = useCallback(
    async (releaseNotes: string) => {
      if (!draft) return;

      const result = await publishCatalog.publish({
        catalogType: selectedType,
        request: {
          data: draft.data,
          releaseNotes: releaseNotes || undefined,
        },
      });

      ui.setPublishDialogOpen(false);
      setVersions((prev) => ({
        ...prev,
        [selectedType]: prev[selectedType] ?? draft.sourceVersion,
      }));
      discardDraft(selectedType);
      setSelectedEntityId(null);
      setSelectedIndex(null);
      ui.setSuccessSnackbar(`Published ${selectedType} v${result.version}`);
    },
    [draft, selectedType, publishCatalog, discardDraft, ui],
  );

  const allVersions = versionData?.versions ?? [];
  const currentVersion = draft?.sourceVersion ?? versions[selectedType];
  const latestVersion = latestPublishedVersion(allVersions, selectedType);
  const notices = draftNoticeFlags({
    draft,
    latestVersion,
    dismissedRestoreNoticeId: ui.dismissedRestoreNoticeId,
    dismissedStaleWarningId: ui.dismissedStaleWarningId,
  });
  const hasValidationErrors = draft
    ? draftHasValidationErrors(draft.data, selectedType)
    : false;

  return {
    selectedType,
    selectedEntityId,
    selectedIndex,
    pendingDelete: ui.pendingDelete,
    discardConfirmOpen: ui.discardConfirmOpen,
    publishDialogOpen: ui.publishDialogOpen,
    successSnackbar: ui.successSnackbar,
    versionData,
    versionsLoading,
    versionsError,
    drafts,
    draft,
    classQuery: queries.classQuery,
    skillQuery: queries.skillQuery,
    statusQuery: queries.statusQuery,
    elementQuery: queries.elementQuery,
    resonanceQuery: queries.resonanceQuery,
    combatConstantsQuery: queries.combatConstantsQuery,
    publishCatalog,
    allVersions,
    currentVersion,
    latestVersion,
    ...notices,
    hasValidationErrors,
    canPublish: account.isAdmin,
    originalData: queries.originalDataFor(selectedType),
    draftActions,
    handleTypeChange,
    handleVersionChange,
    handleSelectEntity,
    handleCreateDraft,
    handleConfirmDiscard,
    handlePublish,
    handleRequestDiscard: ui.handleRequestDiscard,
    handleCancelDiscard: ui.handleCancelDiscard,
    handleOpenPublish: () => {
      if (!account.isAdmin) {
        return;
      }
      publishCatalog.reset();
      ui.setPublishDialogOpen(true);
    },
    handleClosePublish: () => ui.setPublishDialogOpen(false),
    handleCloseSnackbar: ui.handleCloseSnackbar,
    handleRequestDelete: (_id: string, index: number, displayName: string) => {
      ui.setPendingDelete({
        index,
        displayName,
        kindLabel: entityKindLabel(selectedType),
      });
    },
    handleCancelDelete: ui.handleCancelDelete,
    handleConfirmDelete: () => {
      if (ui.pendingDelete) {
        draftActions.handleConfirmDelete(ui.pendingDelete.index);
      }
      ui.setPendingDelete(null);
    },
    dismissRestoreNotice: () => ui.setDismissedRestoreNoticeId(notices.draftIdentity),
    dismissStaleWarning: () => ui.setDismissedStaleWarningId(notices.draftIdentity),
  };
}
