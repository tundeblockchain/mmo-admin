import { useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { formatCatalogType } from '../../../lib/catalogLabels';
import type { PublishTypeResult, PublishableDraft } from '../../../lib/catalogImport';
import { isEmptyListPublish } from '../../../lib/catalogImport';
import { PublishTypeResults } from './PublishTypeResults';

interface PublishAllDialogProps {
  open: boolean;
  items: PublishableDraft[];
  results: PublishTypeResult[] | null;
  isPending: boolean;
  onClose: () => void;
  onPublish: (releaseNotes: string) => Promise<void>;
}

export function PublishAllDialog({
  open,
  items,
  results,
  isPending,
  onClose,
  onPublish,
}: PublishAllDialogProps) {
  const [releaseNotes, setReleaseNotes] = useState('');
  const emptyTypes = items.filter((item) => isEmptyListPublish(item.catalogType, item.data));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="publish-all-title">
      <DialogTitle id="publish-all-title">Publish changed catalog types</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Each changed type is published with its own POST /catalog/{'{type}'}/versions. There is no
          bulk endpoint. If one call fails, earlier types stay published.
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Types to publish
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {items.map((item) => formatCatalogType(item.catalogType)).join(', ') || 'None'}
        </Typography>
        {emptyTypes.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Empty list arrays will be skipped so the server does not return 400:{' '}
            {emptyTypes.map((item) => formatCatalogType(item.catalogType)).join(', ')}
          </Alert>
        )}
        <TextField
          label="Release Notes (optional)"
          multiline
          rows={3}
          fullWidth
          value={releaseNotes}
          onChange={(event) => setReleaseNotes(event.target.value)}
          disabled={isPending}
        />
        {results && <PublishTypeResults results={results} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Close
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            void onPublish(releaseNotes);
          }}
          disabled={isPending || items.length === 0 || results !== null}
          startIcon={isPending ? <CircularProgress size={16} /> : undefined}
        >
          {isPending ? 'Publishing...' : 'Publish each type'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
