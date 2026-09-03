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
} from '@mui/material';
import type { ClassDefinition } from '../../types/catalog';

interface ClassListProps {
  classes: ClassDefinition[] | undefined;
  selectedClassId: string | null;
  onSelectClass: (classId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function ClassList({
  classes,
  selectedClassId,
  onSelectClass,
  isLoading,
  error,
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
      <Alert severity="info">
        No classes found in this version.
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {classes.map((cls) => (
        <ListItem key={cls.classId} disablePadding>
          <ListItemButton
            selected={selectedClassId === cls.classId}
            onClick={() => onSelectClass(cls.classId)}
          >
            <ListItemText
              primary={cls.displayName}
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
  );
}
