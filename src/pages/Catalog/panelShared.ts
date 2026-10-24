import type { useCatalogWorkspace } from './useCatalogWorkspace';

export type CatalogWorkspace = ReturnType<typeof useCatalogWorkspace>;

export interface DraftListProps {
  isDraft: true;
  selectedIndex: number | null;
  onAdd: () => void;
  onRequestDelete: (id: string, index: number, displayName: string) => void;
}

export function draftListProps(
  workspace: CatalogWorkspace,
): DraftListProps | Record<string, never> {
  return workspace.draft
    ? {
        isDraft: true,
        selectedIndex: workspace.selectedIndex,
        onAdd: workspace.draftActions.handleAddEntity,
        onRequestDelete: workspace.handleRequestDelete,
      }
    : {};
}
