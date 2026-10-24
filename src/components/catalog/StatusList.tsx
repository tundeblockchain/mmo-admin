import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { StatusDefinition } from '../../types/catalog';
import { DraftListToolbar } from './DraftListToolbar';

const CATEGORY_COLORS: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  buff: 'success',
  debuff: 'error',
  dot: 'warning',
  hot: 'info',
  control: 'default',
};

interface StatusListProps {
  statuses: StatusDefinition[] | undefined;
  selectedStatusId: string | null;
  selectedIndex?: number | null;
  onSelectStatus: (statusId: string, index: number) => void;
  isLoading: boolean;
  error: Error | null;
  isDraft?: boolean;
  onAdd?: () => void;
  onRequestDelete?: (statusId: string, index: number, displayName: string) => void;
}

export function StatusList({
  statuses,
  selectedStatusId,
  selectedIndex = null,
  onSelectStatus,
  isLoading,
  error,
  isDraft = false,
  onAdd,
  onRequestDelete,
}: StatusListProps) {
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
        Failed to load statuses: {error.message}
      </Alert>
    );
  }

  if (!statuses || statuses.length === 0) {
    return (
      <Box>
        {isDraft && onAdd && <DraftListToolbar label="Status" onAdd={onAdd} />}
        <Alert severity="info">
          No statuses found in this version.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {isDraft && onAdd && <DraftListToolbar label="Status" onAdd={onAdd} />}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {statuses.map((status, index) => (
          <ListItem
            key={`${status.statusId}-${index}`}
            disablePadding
            secondaryAction={
              onRequestDelete ? (
                <IconButton
                  edge="end"
                  aria-label={`Delete ${status.displayName || status.statusId || 'status'}`}
                  onClick={() => onRequestDelete(status.statusId, index, status.displayName)}
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
                  : selectedStatusId === status.statusId
              }
              onClick={() => onSelectStatus(status.statusId, index)}
            >
              <ListItemText
                primary={status.displayName || 'Untitled status'}
                secondary={
                  <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Chip
                      label={status.category}
                      size="small"
                      color={CATEGORY_COLORS[status.category]}
                    />
                    {status.maxStacks > 1 && (
                      <Chip label={`${status.maxStacks} stacks`} size="small" variant="outlined" />
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
