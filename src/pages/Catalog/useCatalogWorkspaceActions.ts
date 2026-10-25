import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { useCreateDraft, useDiscardDraft, type DraftState } from '../../hooks/useDraftCatalog';
import { usePublishCatalog } from '../../hooks/usePublishCatalog';
import { useAccount } from '../../hooks/useAccount';
import { isPublishedVersion } from '../../lib/catalogVersions';
import type { CatalogEntityData, CatalogType } from '../../types/catalog';
import type { VersionSelections } from './catalogPageUtils';
import type { useCatalogWorkspaceUi } from './useCatalogWorkspaceUi';

interface CatalogWorkspaceActionsOptions {
  selectedType: CatalogType;
  draft: DraftState | null;
  versions: VersionSelections;
  originalData: CatalogEntityData | undefined;
  ui: ReturnType<typeof useCatalogWorkspaceUi>;
  setVersions: Dispatch<SetStateAction<VersionSelections>>;
  setSelectedEntityId: (id: string | null) => void;
  setSelectedIndex: (index: number | null) => void;
}

export function useCatalogWorkspaceActions({
  selectedType,
  draft,
  versions,
  originalData,
  ui,
  setVersions,
  setSelectedEntityId,
  setSelectedIndex,
}: CatalogWorkspaceActionsOptions) {
  const createDraft = useCreateDraft();
  const discardDraft = useDiscardDraft();
  const publishCatalog = usePublishCatalog();
  const account = useAccount();

  const clearSelection = useCallback(() => {
    setSelectedEntityId(null);
    setSelectedIndex(null);
  }, [setSelectedEntityId, setSelectedIndex]);

  const handleCreateDraft = useCallback(() => {
    const currentVersion = versions[selectedType];
    if (currentVersion === null || !originalData) return;
    createDraft(selectedType, currentVersion, originalData);
  }, [selectedType, versions, originalData, createDraft]);

  const handleConfirmDiscard = useCallback(() => {
    if (draft && versions[selectedType] === null && isPublishedVersion(draft.sourceVersion)) {
      setVersions((prev) => ({ ...prev, [selectedType]: draft.sourceVersion }));
    }
    discardDraft(selectedType);
    clearSelection();
    ui.setPendingDelete(null);
    ui.setDiscardConfirmOpen(false);
  }, [draft, selectedType, versions, discardDraft, ui, setVersions, clearSelection]);

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
      setVersions((prev) => ({ ...prev, [selectedType]: result.version }));
      discardDraft(selectedType);
      clearSelection();
      ui.setSuccessSnackbar(`Published ${selectedType} v${result.version}`);
    },
    [draft, selectedType, publishCatalog, discardDraft, ui, setVersions, clearSelection],
  );

  return {
    publishCatalog,
    canPublish: account.isAdmin,
    handleCreateDraft,
    handleConfirmDiscard,
    handlePublish,
    handleOpenPublish: () => {
      if (!account.isAdmin) {
        return;
      }
      publishCatalog.reset();
      ui.setPublishDialogOpen(true);
    },
    handleClosePublish: () => ui.setPublishDialogOpen(false),
    handleRequestAdd: () => ui.setAddDialogOpen(true),
    handleCloseAdd: () => ui.setAddDialogOpen(false),
  };
}
