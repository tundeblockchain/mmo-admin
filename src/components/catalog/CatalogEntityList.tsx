import { type ReactNode } from 'react';
import { Alert, Box, CircularProgress, List, Typography } from '@mui/material';
import { CatalogEntityRow } from './CatalogEntityRow';
import { DraftListToolbar } from './DraftListToolbar';

export interface CatalogEntityListProps<T> {
  items: T[] | undefined;
  selectedId: string | null;
  selectedIndex?: number | null;
  getId: (item: T) => string;
  getDisplayName: (item: T) => string;
  untitledLabel: string;
  entityLabel: string;
  emptyNoun: string;
  onSelect: (id: string, index: number) => void;
  isLoading: boolean;
  error: Error | null;
  isDraft?: boolean;
  onAdd?: () => void;
  onRequestDelete?: (id: string, index: number, displayName: string) => void;
  renderSecondary?: (item: T) => ReactNode;
  renderMeta?: (item: T) => ReactNode;
  renderLeading?: (item: T) => ReactNode;
  groupBy?: (item: T) => string;
}

export function CatalogEntityList<T>({
  items,
  selectedId,
  selectedIndex = null,
  getId,
  getDisplayName,
  untitledLabel,
  entityLabel,
  emptyNoun,
  onSelect,
  isLoading,
  error,
  isDraft = false,
  onAdd,
  onRequestDelete,
  renderSecondary,
  renderMeta,
  renderLeading,
  groupBy,
}: CatalogEntityListProps<T>) {
  const toolbar = isDraft && onAdd ? <DraftListToolbar label={entityLabel} onAdd={onAdd} /> : null;

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
        Failed to load {emptyNoun}: {error.message}
      </Alert>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box>
        {toolbar}
        <Alert severity="info">No {emptyNoun} found in this version.</Alert>
      </Box>
    );
  }

  const rowProps = {
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
  };

  if (groupBy) {
    const grouped = items.reduce<Record<string, Array<{ item: T; index: number }>>>(
      (acc, item, index) => {
        const group = groupBy(item);
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push({ item, index });
        return acc;
      },
      {},
    );

    return (
      <Box>
        {toolbar}
        {Object.entries(grouped).map(([group, groupItems]) => (
          <Box key={group} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'grey.100',
                textTransform: 'capitalize',
              }}
            >
              {group}
            </Typography>
            <List disablePadding>
              {groupItems.map(({ item, index }) => (
                <CatalogEntityRow key={`${getId(item)}-${index}`} item={item} index={index} {...rowProps} />
              ))}
            </List>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {toolbar}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {items.map((item, index) => (
          <CatalogEntityRow key={`${getId(item)}-${index}`} item={item} index={index} {...rowProps} />
        ))}
      </List>
    </Box>
  );
}
