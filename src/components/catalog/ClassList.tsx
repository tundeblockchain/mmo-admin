import { Box, Chip, Typography } from '@mui/material';
import type { ClassDefinition } from '../../types/catalog';
import { CatalogEntityList } from './CatalogEntityList';

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
  return (
    <CatalogEntityList
      items={classes}
      selectedId={selectedClassId}
      selectedIndex={selectedIndex}
      getId={(item) => item.classId}
      getDisplayName={(item) => item.displayName}
      untitledLabel="class"
      entityLabel="Class"
      emptyNoun="classes"
      onSelect={onSelectClass}
      isLoading={isLoading}
      error={error}
      isDraft={isDraft}
      onAdd={onAdd}
      onRequestDelete={onRequestDelete}
      renderSecondary={(cls) => (
        <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          {cls.roles.map((role) => (
            <Chip key={role} label={role} size="small" variant="outlined" />
          ))}
        </Box>
      )}
      renderMeta={(cls) => (
        <Typography variant="caption" color="text.secondary">
          {cls.primaryResource}
        </Typography>
      )}
    />
  );
}
