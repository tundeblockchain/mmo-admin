import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { getAddEntryConfig, type AddEntryEntity } from '../../../lib/addEntry';
import type { CatalogType } from '../../../types/catalog';
import { AddEntryForm } from './AddEntryForm';

interface AddEntryDialogProps {
  open: boolean;
  catalogType: CatalogType;
  existingIds: string[];
  onClose: () => void;
  onSubmit: (entry: AddEntryEntity) => void;
}

export function AddEntryDialog({
  open,
  catalogType,
  existingIds,
  onClose,
  onSubmit,
}: AddEntryDialogProps) {
  const config = getAddEntryConfig(catalogType);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{config.title}</DialogTitle>
      <DialogContent
        sx={(theme) => ({
          // MUI sets padding-top: 0 when DialogContent follows DialogTitle.
          '&&': {
            paddingTop: theme.spacing(2),
          },
        })}
      >
        {open && (
          <AddEntryForm
            key={`${catalogType}-${String(open)}`}
            catalogType={catalogType}
            existingIds={existingIds}
            onCancel={onClose}
            onSubmit={(entry) => {
              onSubmit(entry);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
