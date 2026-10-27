import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { catalogTypeFromSection } from '../../lib/catalogRoutes';
import { useDraftStore, restorePersistedDraft } from '../../hooks/useDraftCatalog';
import { useCatalogDraftActions } from '../../hooks/useCatalogDraftActions';
import { collectEntityIds } from '../../lib/catalogIds';
import { emptyOriginalData } from '../../lib/emptyCatalog';
import { useCatalogDependencySnapshot } from '../../hooks/useLatestCatalogEntries';
import { publishedVersionOrNull } from '../../lib/catalogVersions';
import { draftHasValidationErrors } from '../../lib/catalogValidation';
import { supportsAddEntry } from '../../lib/addEntry';
import type { CatalogType } from '../../types/catalog';
import { latestVersionsByType } from './catalogPageUtils';
import { useCatalogQueries } from './useCatalogQueries';
import { draftNoticeFlags, useCatalogWorkspaceUi } from './useCatalogWorkspaceUi';
import { useCatalogWorkspaceActions } from './useCatalogWorkspaceActions';
import { useCatalogDelete } from './useCatalogDelete';
import { usePublishedCatalogSelection } from './usePublishedCatalogSelection';

export function useCatalogWorkspace() {
  const { catalogSection } = useParams<{ catalogSection: string }>();
  const selectedType = catalogTypeFromSection(catalogSection) ?? 'class';
  const selection = usePublishedCatalogSelection();
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectionType, setSelectionType] = useState<CatalogType>(selectedType);
  const ui = useCatalogWorkspaceUi();

  if (selectionType !== selectedType) {
    setSelectionType(selectedType);
    setSelectedEntityId(null);
    setSelectedIndex(null);
    if (ui.pendingDelete !== null) {
      ui.setPendingDelete(null);
    }
    if (ui.addDialogOpen) {
      ui.setAddDialogOpen(false);
    }
  }

  const drafts = useDraftStore();
  const draft = drafts[selectedType];
  const queries = useCatalogQueries(drafts, selection.selections);
  const originalData = queries.originalDataFor(selectedType);
  const latestVersion = selection.latestFor(selectedType);
  const hasPublishedVersion = selection.hasPublishedVersion(selectedType);
  const actions = useCatalogWorkspaceActions({
    selectedType,
    draft,
    versions: selection.selections,
    originalData,
    ui,
    setVersions: selection.setOverrides,
    setSelectedEntityId,
    setSelectedIndex,
  });
  const draftActions = useCatalogDraftActions({
    draft,
    selectedType,
    selectedIndex,
    latestVersion,
    setSelectedEntityId,
    setSelectedIndex,
  });
  const dependencySnapshot = useCatalogDependencySnapshot(
    drafts,
    selection.latestQuery.data,
    selection.latestQuery.isSuccess,
  );
  const catalogDelete = useCatalogDelete({
    selectedType,
    draft,
    snapshot: dependencySnapshot.snapshot,
    ready: dependencySnapshot.ready,
    draftActions,
    ui,
  });

  const selectPublishedVersion = selection.handleVersionChange;
  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    selectPublishedVersion(type, version);
    setSelectedEntityId(null);
    setSelectedIndex(null);
    restorePersistedDraft(type, version);
  }, [selectPublishedVersion]);

  const publishedSelection = publishedVersionOrNull(
    draft?.sourceVersion ?? selection.selections[selectedType],
  );
  const currentVersion = draft ? draft.sourceVersion : selection.selections[selectedType];
  const showEmptyCatalog = selection.showEmptyCatalog(selectedType) && !draft;
  const existingIds =
    draft && selectedType !== 'combat-constants' ? collectEntityIds(draft.data, selectedType) : [];

  return {
    selectedType,
    selectedEntityId,
    selectedIndex,
    ...catalogDelete,
    discardConfirmOpen: ui.discardConfirmOpen,
    publishDialogOpen: ui.publishDialogOpen,
    addDialogOpen: ui.addDialogOpen,
    successSnackbar: ui.successSnackbar,
    versionData: selection.versionData,
    versionsLoading: selection.versionsLoading,
    versionsError: selection.versionsError,
    drafts,
    draft,
    classQuery: queries.classQuery,
    skillQuery: queries.skillQuery,
    statusQuery: queries.statusQuery,
    elementQuery: queries.elementQuery,
    resonanceQuery: queries.resonanceQuery,
    combatConstantsQuery: queries.combatConstantsQuery,
    publishCatalog: actions.publishCatalog,
    allVersions: selection.allVersions,
    currentVersion,
    publishedSelection,
    latestVersion,
    showEmptyCatalog,
    canAddEntry: supportsAddEntry(selectedType, hasPublishedVersion),
    existingIds,
    ...draftNoticeFlags({
      draft,
      latestVersion,
      dismissedRestoreNoticeId: ui.dismissedRestoreNoticeId,
      dismissedStaleWarningId: ui.dismissedStaleWarningId,
    }),
    hasValidationErrors: draft ? draftHasValidationErrors(draft.data, selectedType) : false,
    canPublish: actions.canPublish,
    originalData: originalData ?? emptyOriginalData(selectedType),
    catalogQueryData: queries.catalogQueryData,
    latestByType: latestVersionsByType(selection.latestQuery.data?.versions),
    draftActions,
    handleVersionChange,
    handleSelectEntity: (id: string, index: number) => {
      setSelectedEntityId(id);
      setSelectedIndex(index);
    },
    handleCreateDraft: actions.handleCreateDraft,
    handleConfirmDiscard: actions.handleConfirmDiscard,
    handlePublish: actions.handlePublish,
    handleRequestDiscard: ui.handleRequestDiscard,
    handleCancelDiscard: ui.handleCancelDiscard,
    handleOpenPublish: actions.handleOpenPublish,
    handleClosePublish: actions.handleClosePublish,
    handleRequestAdd: actions.handleRequestAdd,
    handleCloseAdd: actions.handleCloseAdd,
    handleCloseSnackbar: ui.handleCloseSnackbar,
    dismissRestoreNotice: () => ui.setDismissedRestoreNoticeId(
      draft ? `${draft.catalogType}:${draft.sourceVersion}` : null,
    ),
    dismissStaleWarning: () => ui.setDismissedStaleWarningId(
      draft ? `${draft.catalogType}:${draft.sourceVersion}` : null,
    ),
  };
}
