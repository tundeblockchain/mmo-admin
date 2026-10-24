import { Box, Chip } from '@mui/material';
import type { StatusDefinition } from '../../types/catalog';
import { CatalogEntityList } from './CatalogEntityList';

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
  return (
    <CatalogEntityList
      items={statuses}
      selectedId={selectedStatusId}
      selectedIndex={selectedIndex}
      getId={(item) => item.statusId}
      getDisplayName={(item) => item.displayName}
      untitledLabel="status"
      entityLabel="Status"
      emptyNoun="statuses"
      onSelect={onSelectStatus}
      isLoading={isLoading}
      error={error}
      isDraft={isDraft}
      onAdd={onAdd}
      onRequestDelete={onRequestDelete}
      renderSecondary={(status) => (
        <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <Chip label={status.category} size="small" color={CATEGORY_COLORS[status.category]} />
          {status.maxStacks > 1 && (
            <Chip label={`${status.maxStacks} stacks`} size="small" variant="outlined" />
          )}
        </Box>
      )}
    />
  );
}
