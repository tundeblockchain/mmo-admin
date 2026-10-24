import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ClassDefinition } from '../../types/catalog';
import { DraftListToolbar } from './DraftListToolbar';

interface ClassListProps {
  classes: ClassDefinition[] | undefined;
  selectedClassId: string | null;
  selectedIndex?: number | null;
  onSelectClass: (classId: string, index: number) => void;
  isLoading: boolean;
  error: Error | null;
  isDraft?: boolean;
  onAdd?: () => void;
  onRequestDelete?: (classId: string, index: number, displayName: string) => void;
}

export function ClassList({
  classes,
  selectedClassId,
  selectedIndex = null,
  onSelectClass,
  isLoading,
  error,
  isDraft = false,
  onAdd,
  onRequestDelete,
}: ClassListProps) {
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
        Failed to load classes: {error.message}
      </Alert>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <Box>
        {isDraft && onAdd && <DraftListToolbar label="Class" onAdd={onAdd} />}
        <Alert severity="info">
          No classes found in this version.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {isDraft && onAdd && <DraftListToolbar label="Class" onAdd={onAdd} />}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {classes.map((cls, index) => (
          <ListItem
            key={`${cls.classId}-${index}`}
            disablePadding
            secondaryAction={
              onRequestDelete ? (
                <IconButton
                  edge="end"
                  aria-label={`Delete ${cls.displayName || cls.classId || 'class'}`}
                  onClick={() => onRequestDelete(cls.classId, index, cls.displayName)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : undefined
            }
          >
            <ListItemButton
              selected={selectedIndex !== null ? selectedIndex === index : selectedClassId === cls.classId}
              onClick={() => onSelectClass(cls.classId, index)}
            >
              <ListItemText
                primary={cls.displayName || 'Untitled class'}
                secondary={
                  <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {cls.roles.map((role) => (
                      <Chip key={role} label={role} size="small" variant="outlined" />
                    ))}
                  </Box>
                }
              />
              <Typography variant="caption" color="text.secondary">
                {cls.primaryResource}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
