import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { StatusDefinition } from '../../types/catalog';

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
  onSelectStatus: (statusId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function StatusList({
  statuses,
  selectedStatusId,
  onSelectStatus,
  isLoading,
  error,
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
      <Alert severity="info">
        No statuses found in this version.
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {statuses.map((status) => (
        <ListItem key={status.statusId} disablePadding>
          <ListItemButton
            selected={selectedStatusId === status.statusId}
            onClick={() => onSelectStatus(status.statusId)}
          >
            <ListItemText
              primary={status.displayName}
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
  );
}
