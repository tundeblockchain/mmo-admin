import { Box } from '@mui/material';
import type { ElementDefinition } from '../../types/catalog';
import { CatalogEntityList } from './CatalogEntityList';

interface ElementListProps {
  elements: ElementDefinition[] | undefined;
  selectedElementId: string | null;
  selectedIndex?: number | null;
  onSelectElement: (elementId: string, index: number) => void;
  isLoading: boolean;
  error: Error | null;
  isDraft?: boolean;
  onAdd?: () => void;
  onRequestDelete?: (elementId: string, index: number, displayName: string) => void;
}

export function ElementList({
  elements,
  selectedElementId,
  selectedIndex = null,
  onSelectElement,
  isLoading,
  error,
  isDraft = false,
  onAdd,
  onRequestDelete,
}: ElementListProps) {
  return (
    <CatalogEntityList
      items={elements}
      selectedId={selectedElementId}
      selectedIndex={selectedIndex}
      getId={(item) => item.elementId}
      getDisplayName={(item) => item.displayName}
      untitledLabel="element"
      entityLabel="Element"
      emptyNoun="elements"
      onSelect={onSelectElement}
      isLoading={isLoading}
      error={error}
      isDraft={isDraft}
      onAdd={onAdd}
      onRequestDelete={onRequestDelete}
      renderLeading={(element) => (
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: element.color,
            mr: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
      )}
    />
  );
}
