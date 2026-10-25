import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { catalogTypeFromSection } from '../../lib/catalogRoutes';
import { useCatalogVersions } from '../../hooks/useCatalogVersions';
import { useLatestCatalogVersions } from '../../hooks/useLatestCatalogVersions';
import { useDraftStore, restorePersistedDraft } from '../../hooks/useDraftCatalog';
import { useCatalogDraftActions } from '../../hooks/useCatalogDraftActions';
import { collectEntityIds } from '../../lib/catalogIds';
import { entityKindLabel } from '../../lib/catalogLabels';
import { emptyOriginalData } from '../../lib/emptyCatalog';
import {
  latestPublishedVersion,
  latestVersionFromMap,
  publishedVersionOrNull,
} from '../../lib/catalogVersions';
import { draftHasValidationErrors } from '../../lib/catalogValidation';
import { supportsAddEntry } from '../../lib/addEntry';
import type { CatalogType } from '../../types/catalog';
import { emptyVersionSelections, type VersionSelections } from './catalogPageUtils';
import { useCatalogQueries } from './useCatalogQueries';
import { draftNoticeFlags, useCatalogWorkspaceUi } from './useCatalogWorkspaceUi';
import { useCatalogWorkspaceActions } from './useCatalogWorkspaceActions';

export function useCatalogWorkspace() {
  const { catalogSection } = useParams<{ catalogSection: string }>();
  const selectedType = catalogTypeFromSection(catalogSection) ?? 'class';
  const [versions, setVersions] = useState<VersionSelections>(emptyVersionSelections);
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

  const versionsQuery = useCatalogVersions();
  const latestQuery = useLatestCatalogVersions();
  const drafts = useDraftStore();
  const draft = drafts[selectedType];
  const queries = useCatalogQueries(drafts, versions);
  const originalData = queries.originalDataFor(selectedType);
  const actions = useCatalogWorkspaceActions({
    selectedType,
    draft,
    versions,
    originalData,
    ui,
    setVersions,
    setSelectedEntityId,
    setSelectedIndex,
  });
  const allVersions = versionsQuery.data?.versions ?? [];
  const latestVersion =
    latestPublishedVersion(allVersions, selectedType) ??
    latestVersionFromMap(latestQuery.data, selectedType);
  const draftActions = useCatalogDraftActions({
    draft,
    selectedType,
    selectedIndex,
    latestVersion,
    setSelectedEntityId,
    setSelectedIndex,
  });

  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    setVersions((prev) => ({ ...prev, [type]: version }));
    setSelectedEntityId(null);
    setSelectedIndex(null);
    restorePersistedDraft(type, version);
  }, []);

  const typeVersionCount = allVersions.filter((item) => item.catalogType === selectedType).length;
  const hasPublishedVersion = latestVersion !== null || typeVersionCount > 0;
  const publishedSelection = publishedVersionOrNull(draft?.sourceVersion ?? versions[selectedType]);
  const currentVersion = draft ? draft.sourceVersion : versions[selectedType];
  const showEmptyCatalog =
    !versionsQuery.isPending &&
    versionsQuery.error == null &&
    !draft &&
    !hasPublishedVersion;
  const existingIds =
    draft && selectedType !== 'combat-constants' ? collectEntityIds(draft.data, selectedType) : [];

  return {
    selectedType,
    selectedEntityId,
    selectedIndex,
    pendingDelete: ui.pendingDelete,
    discardConfirmOpen: ui.discardConfirmOpen,
    publishDialogOpen: ui.publishDialogOpen,
    addDialogOpen: ui.addDialogOpen,
    successSnackbar: ui.successSnackbar,
    versionData: versionsQuery.data,
    versionsLoading: versionsQuery.isPending,
    versionsError: versionsQuery.error,
    drafts,
    draft,
    classQuery: queries.classQuery,
    skillQuery: queries.skillQuery,
    statusQuery: queries.statusQuery,
    elementQuery: queries.elementQuery,
    resonanceQuery: queries.resonanceQuery,
    combatConstantsQuery: queries.combatConstantsQuery,
    publishCatalog: actions.publishCatalog,
    allVersions,
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
    dismissRestoreNotice: () => ui.setDismissedRestoreNoticeId(
      draft ? `${draft.catalogType}:${draft.sourceVersion}` : null,
    ),
    dismissStaleWarning: () => ui.setDismissedStaleWarningId(
      draft ? `${draft.catalogType}:${draft.sourceVersion}` : null,
    ),
  };
}
