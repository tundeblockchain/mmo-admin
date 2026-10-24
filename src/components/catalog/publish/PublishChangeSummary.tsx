import { Box, Chip, List, ListItem, ListItemText, Typography } from '@mui/material';
import type { CatalogType, CatalogEntityData } from '../../../types/catalog';
import { computeDiffSummary } from '../../../lib/catalogDiff';

interface PublishChangeSummaryProps {
  catalogType: CatalogType;
  originalData: CatalogEntityData;
  draftData: CatalogEntityData;
}

export function PublishChangeSummary({
  catalogType,
  originalData,
  draftData,
}: PublishChangeSummaryProps) {
  const diffSummary = computeDiffSummary(originalData, draftData, catalogType);
  const hasChanges = diffSummary.added > 0 || diffSummary.modified > 0 || diffSummary.removed > 0;

  return (
    <List dense disablePadding>
      {diffSummary.added > 0 && (
        <ListItem disablePadding sx={{ py: 0.5 }}>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Added" color="success" size="small" />
                <Typography variant="body2">{diffSummary.added} entities</Typography>
              </Box>
            }
          />
        </ListItem>
      )}
      {diffSummary.modified > 0 && (
        <ListItem disablePadding sx={{ py: 0.5 }}>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Modified" color="warning" size="small" />
                <Typography variant="body2">{diffSummary.modified} entities</Typography>
              </Box>
            }
          />
        </ListItem>
      )}
      {diffSummary.removed > 0 && (
        <ListItem disablePadding sx={{ py: 0.5 }}>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Removed" color="error" size="small" />
                <Typography variant="body2">{diffSummary.removed} entities</Typography>
              </Box>
            }
          />
        </ListItem>
      )}
      {!hasChanges && (
        <ListItem disablePadding sx={{ py: 0.5 }}>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary">
                No changes detected
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );
}

export function hasPublishableChanges(
  catalogType: CatalogType,
  originalData: CatalogEntityData,
  draftData: CatalogEntityData,
): boolean {
  const diffSummary = computeDiffSummary(originalData, draftData, catalogType);
  return diffSummary.added > 0 || diffSummary.modified > 0 || diffSummary.removed > 0;
}
