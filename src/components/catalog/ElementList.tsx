import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { ElementDefinition } from '../../types/catalog';

interface ElementListProps {
  elements: ElementDefinition[] | undefined;
  selectedElementId: string | null;
  onSelectElement: (elementId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function ElementList({
  elements,
  selectedElementId,
  onSelectElement,
  isLoading,
  error,
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
      <Alert severity="info">
        No elements found in this version.
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {elements.map((element) => (
        <ListItem key={element.elementId} disablePadding>
          <ListItemButton
            selected={selectedElementId === element.elementId}
            onClick={() => onSelectElement(element.elementId)}
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
            <ListItemText primary={element.displayName} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
