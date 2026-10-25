import { Box, Button, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { formatCatalogType } from '../../../lib/catalogLabels';
import type { CatalogType } from '../../../types/catalog';

interface CatalogEmptyStateProps {
  catalogType: CatalogType;
  onAdd: () => void;
}

export function CatalogEmptyState({ catalogType, onAdd }: CatalogEmptyStateProps) {
  const label = formatCatalogType(catalogType);

  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        No published {label.toLowerCase()} catalog yet. Add an entry to create the first draft,
        then publish version 1.
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
          Add {label === 'Combat Constants' ? 'Combat Constants' : label}
        </Button>
      </Box>
    </Paper>
  );
}
