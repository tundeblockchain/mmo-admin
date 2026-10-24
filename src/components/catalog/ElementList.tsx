import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ElementDefinition } from '../../types/catalog';
import { DraftListToolbar } from './DraftListToolbar';

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
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load elements: {error.message}
      </Alert>
    );
  }

  if (!elements || elements.length === 0) {
    return (
      <Box>
        {isDraft && onAdd && <DraftListToolbar label="Element" onAdd={onAdd} />}
        <Alert severity="info">
          No elements found in this version.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {isDraft && onAdd && <DraftListToolbar label="Element" onAdd={onAdd} />}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {elements.map((element, index) => (
          <ListItem
            key={`${element.elementId}-${index}`}
            disablePadding
            secondaryAction={
              onRequestDelete ? (
                <IconButton
                  edge="end"
                  aria-label={`Delete ${element.displayName || element.elementId || 'element'}`}
                  onClick={() => onRequestDelete(element.elementId, index, element.displayName)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : undefined
            }
          >
            <ListItemButton
              selected={
                selectedIndex !== null
                  ? selectedIndex === index
                  : selectedElementId === element.elementId
              }
              onClick={() => onSelectElement(element.elementId, index)}
            >
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
              <ListItemText primary={element.displayName || 'Untitled element'} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
