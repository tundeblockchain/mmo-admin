import { type ReactNode } from 'react';
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface CatalogEntityRowProps<T> {
  item: T;
  index: number;
  selectedId: string | null;
  selectedIndex: number | null;
  getId: (item: T) => string;
  getDisplayName: (item: T) => string;
  untitledLabel: string;
  onSelect: (id: string, index: number) => void;
  onRequestDelete?: (id: string, index: number, displayName: string) => void;
  renderSecondary?: (item: T) => ReactNode;
  renderMeta?: (item: T) => ReactNode;
  renderLeading?: (item: T) => ReactNode;
}

export function CatalogEntityRow<T>({
  item,
  index,
  selectedId,
  selectedIndex,
  getId,
  getDisplayName,
  untitledLabel,
  onSelect,
  onRequestDelete,
  renderSecondary,
  renderMeta,
  renderLeading,
}: CatalogEntityRowProps<T>) {
  const id = getId(item);
  const displayName = getDisplayName(item);

  return (
    <ListItem
      key={`${id}-${index}`}
      disablePadding
      secondaryAction={
        onRequestDelete ? (
          <IconButton
            edge="end"
            aria-label={`Delete ${displayName || id || untitledLabel}`}
            onClick={() => onRequestDelete(id, index, displayName)}
          >
            <DeleteIcon />
          </IconButton>
        ) : undefined
      }
    >
      <ListItemButton
        selected={selectedIndex !== null ? selectedIndex === index : selectedId === id}
        onClick={() => onSelect(id, index)}
      >
        {renderLeading?.(item)}
        <ListItemText
          primary={displayName || `Untitled ${untitledLabel}`}
          secondary={renderSecondary?.(item)}
        />
        {renderMeta?.(item)}
      </ListItemButton>
    </ListItem>
  );
}
