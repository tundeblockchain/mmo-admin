import { List, ListItem, ListItemText } from '@mui/material';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatCatalogType } from '../../lib/catalogLabels';
import type { CatalogDeleteEvaluation } from '../../lib/evaluateCatalogDelete';

interface DeleteEntryPending {
  displayName: string;
  kindLabel: string;
}

interface DeleteEntryDialogProps {
  pending: DeleteEntryPending;
  evaluation: CatalogDeleteEvaluation;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteEntryDialog({
  pending,
  evaluation,
  onClose,
  onConfirm,
}: DeleteEntryDialogProps) {
  const entryName = pending.displayName || 'this entry';

  if (evaluation.status === 'loading') {
    return (
      <ConfirmDialog
        open
        title={`Delete ${pending.kindLabel}?`}
        description={`Checking whether other catalog entries reference "${entryName}".`}
        closeLabel="Cancel"
        onClose={onClose}
      />
    );
  }

  if (evaluation.status === 'last-entry') {
    return (
      <ConfirmDialog
        open
        title={`Cannot delete ${pending.kindLabel}`}
        description={evaluation.message}
        closeLabel="Close"
        onClose={onClose}
      />
    );
  }

  if (evaluation.status === 'blocked') {
    return (
      <ConfirmDialog
        open
        title={`Cannot delete ${pending.kindLabel}`}
        description={`"${entryName}" is still referenced by other catalog entries. Remove or update these references first.`}
        closeLabel="Close"
        onClose={onClose}
      >
        <List dense aria-label="Dependent catalog entries">
          {evaluation.dependents.map((item) => (
            <ListItem key={`${item.catalogType}:${item.id}`}>
              <ListItemText
                primary={item.displayName}
                secondary={formatCatalogType(item.catalogType)}
              />
            </ListItem>
          ))}
        </List>
      </ConfirmDialog>
    );
  }

  return (
    <ConfirmDialog
      open
      title={`Delete ${pending.kindLabel}?`}
      description={`Delete "${entryName}" from this draft? This only affects the working copy.`}
      confirmLabel="Delete"
      confirmColor="error"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
