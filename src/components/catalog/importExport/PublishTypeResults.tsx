import { Alert, List, ListItem, ListItemText, Typography } from '@mui/material';
import { formatCatalogType } from '../../../lib/catalogLabels';
import type { PublishTypeResult } from '../../../lib/catalogImport';

interface PublishTypeResultsProps {
  results: PublishTypeResult[];
}

function resultMessage(result: PublishTypeResult): string {
  if (result.status === 'published') {
    return `Published ${formatCatalogType(result.catalogType)} v${result.version}`;
  }
  if (result.status === 'skipped') {
    return result.message ?? 'Skipped';
  }
  return result.message ?? 'Publish failed';
}

function resultSeverity(status: PublishTypeResult['status']): 'success' | 'warning' | 'error' {
  if (status === 'published') {
    return 'success';
  }
  if (status === 'skipped') {
    return 'warning';
  }
  return 'error';
}

export function PublishTypeResults({ results }: PublishTypeResultsProps) {
  return (
    <List aria-label="Per-type publish results" dense>
      {results.map((result) => (
        <ListItem key={result.catalogType} disableGutters>
          <ListItemText
            primary={
              <Alert severity={resultSeverity(result.status)} role="status">
                <Typography variant="body2">{resultMessage(result)}</Typography>
              </Alert>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
