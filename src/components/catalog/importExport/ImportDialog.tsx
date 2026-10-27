import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import type { CatalogType } from '../../../types/catalog';
import { formatCatalogType } from '../../../lib/catalogLabels';
import type { FieldError } from '../../../lib/catalogImport';
import { ImportErrorList } from './ImportErrorList';

interface ImportDialogProps {
  open: boolean;
  errors: FieldError[] | null;
  appliedTypes: CatalogType[] | null;
  onClose: () => void;
  onFile: (file: File) => Promise<void>;
}

export function ImportDialog({
  open,
  errors,
  appliedTypes,
  onClose,
  onFile,
}: ImportDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="import-catalog-title">
      <DialogTitle id="import-catalog-title">Import catalog JSON</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Load a catalog JSON file into the draft only. Nothing is published until you publish each
          changed type.
        </Typography>
        <Button variant="outlined" component="label">
          Choose JSON file
          <input
            hidden
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) {
                void onFile(file);
              }
            }}
          />
        </Button>
        {errors && errors.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }} role="alert">
            <Typography variant="subtitle2" gutterBottom>
              Import failed. The draft was not changed.
            </Typography>
            <ImportErrorList errors={errors} />
          </Alert>
        )}
        {appliedTypes && appliedTypes.length > 0 && (
          <Alert severity="success" sx={{ mt: 2 }} role="status">
            Loaded {appliedTypes.map((type) => formatCatalogType(type)).join(', ')} into draft.
            Publish to make these versions live.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
