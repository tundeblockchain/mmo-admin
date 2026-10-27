import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type { ExportSource } from '../../../lib/catalogImport';

interface ExportDialogProps {
  open: boolean;
  hasDraft: boolean;
  hasPublished: boolean;
  onClose: () => void;
  onExport: (source: ExportSource) => void;
}

export function ExportDialog({
  open,
  hasDraft,
  hasPublished,
  onClose,
  onExport,
}: ExportDialogProps) {
  const [sourceOverride, setSourceOverride] = useState<ExportSource | null>(null);
  const selected: ExportSource = sourceOverride ?? (hasDraft ? 'draft' : 'published');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="export-catalog-title">
      <DialogTitle id="export-catalog-title">Export catalog JSON</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Download a JSON file in the same format Import accepts.
        </Typography>
        <FormControl>
          <FormLabel id="export-source-label">Source</FormLabel>
          <RadioGroup
            aria-labelledby="export-source-label"
            value={selected}
            onChange={(event) => setSourceOverride(event.target.value as ExportSource)}
          >
            <FormControlLabel
              value="draft"
              control={<Radio />}
              label="Current draft (falls back to published data when a type has no draft)"
              disabled={!hasDraft && !hasPublished}
            />
            <FormControlLabel
              value="published"
              control={<Radio />}
              label="Selected published versions"
              disabled={!hasPublished}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onExport(selected)}
          disabled={selected === 'draft' ? !hasDraft && !hasPublished : !hasPublished}
        >
          Download JSON
        </Button>
      </DialogActions>
    </Dialog>
  );
}
