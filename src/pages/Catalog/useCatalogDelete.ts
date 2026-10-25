import { entityKindLabel } from '../../lib/catalogLabels';
import {
  evaluateCatalogDelete,
  type CatalogDeleteEvaluation,
} from '../../lib/evaluateCatalogDelete';
import { draftListLength } from '../../lib/catalogSnapshots';
import type { CatalogEntriesSnapshot, CatalogReadiness } from '../../lib/catalogDependents';
import type { CatalogType } from '../../types/catalog';
import type { DraftState } from '../../hooks/useDraftCatalog';
import type { useCatalogWorkspaceUi } from './useCatalogWorkspaceUi';

interface UseCatalogDeleteOptions {
  selectedType: CatalogType;
  draft: DraftState | null;
  snapshot: CatalogEntriesSnapshot;
  ready: CatalogReadiness;
  draftActions: { handleConfirmDelete: (index: number) => void };
  ui: ReturnType<typeof useCatalogWorkspaceUi>;
}

export function useCatalogDelete({
  selectedType,
  draft,
  snapshot,
  ready,
  draftActions,
  ui,
}: UseCatalogDeleteOptions) {
  const deleteEvaluation: CatalogDeleteEvaluation | null = ui.pendingDelete
    ? evaluateCatalogDelete({
        catalogType: selectedType,
        draftLength: draftListLength(draft?.data),
        entityId: ui.pendingDelete.entityId,
        snapshot,
        ready,
      })
    : null;

  return {
    pendingDelete: ui.pendingDelete,
    deleteEvaluation,
    handleRequestDelete: (id: string, index: number, displayName: string) => {
      ui.setPendingDelete({
        index,
        displayName,
        entityId: id,
        kindLabel: entityKindLabel(selectedType),
      });
    },
    handleCancelDelete: ui.handleCancelDelete,
    handleConfirmDelete: () => {
      if (ui.pendingDelete && deleteEvaluation?.status === 'confirm') {
        draftActions.handleConfirmDelete(ui.pendingDelete.index);
      }
      ui.setPendingDelete(null);
    },
  };
}
