import { useCallback, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import type { CatalogEntityData, CatalogType } from '../../types/catalog';
import { formatCatalogType } from '../../lib/catalogLabels';
import { hasPublishableChanges, PublishChangeSummary } from './publish/PublishChangeSummary';
import {
  ADMIN_FORBIDDEN_PUBLISH_MESSAGE,
  BAD_REQUEST_PUBLISH_MESSAGE,
  publishFailureMessage,
} from './publish/publishMessages';

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  onPublish: (releaseNotes: string) => Promise<void>;
  catalogType: CatalogType;
  sourceVersion: number;
  originalData: CatalogEntityData;
  draftData: CatalogEntityData;
  isPending: boolean;
  error: Error | null;
  isConflictError: boolean;
  isAuthError: boolean;
  isForbiddenError?: boolean;
  isBadRequestError?: boolean;
  hasValidationErrors?: boolean;
}

function isEmptyArrayCatalog(catalogType: CatalogType, draftData: CatalogEntityData): boolean {
  return catalogType !== 'combat-constants' && Array.isArray(draftData) && draftData.length === 0;
}

export { ADMIN_FORBIDDEN_PUBLISH_MESSAGE, BAD_REQUEST_PUBLISH_MESSAGE };

export function PublishDialog({
  open,
  onClose,
  onPublish,
  catalogType,
  sourceVersion,
  originalData,
  draftData,
  isPending,
  error,
  isConflictError,
  isAuthError,
  isForbiddenError = false,
  isBadRequestError = false,
  hasValidationErrors = false,
}: PublishDialogProps) {
  const [releaseNotes, setReleaseNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [emptyWipeAcknowledged, setEmptyWipeAcknowledged] = useState(false);

  const hasChanges = hasPublishableChanges(catalogType, originalData, draftData);
  const isEmptyArrayPublish = isEmptyArrayCatalog(catalogType, draftData);
  const catalogTypeLabel = formatCatalogType(catalogType).toLowerCase();

  const handleClose = useCallback(() => {
    setReleaseNotes('');
    setShowConfirm(false);
    setEmptyWipeAcknowledged(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Publish {formatCatalogType(catalogType)} Catalog</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Publishing will create a new immutable version based on your draft changes from
            version {sourceVersion}.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Changes Summary
        </Typography>
        <PublishChangeSummary
          catalogType={catalogType}
          originalData={originalData}
          draftData={draftData}
        />

        <Divider sx={{ my: 2 }} />

        <TextField
          label="Release Notes (optional)"
          multiline
          rows={3}
          fullWidth
          value={releaseNotes}
          onChange={(event) => setReleaseNotes(event.target.value)}
          placeholder="Describe the changes in this version..."
          disabled={isPending}
        />

        {isEmptyArrayPublish && (
          <Alert severity="error" sx={{ mt: 2 }} role="alert">
            <Typography variant="body2" sx={{ fontWeight: 'bold' }} gutterBottom>
              This will publish an empty {catalogTypeLabel} catalog and remove all entries.
            </Typography>
            <Typography variant="body2">
              The backend treats an empty data array as a full wipe of this catalog type.
            </Typography>
          </Alert>
        )}

        {isEmptyArrayPublish && (
          <FormControlLabel
            sx={{ mt: 1, alignItems: 'flex-start' }}
            control={
              <Checkbox
                checked={emptyWipeAcknowledged}
                onChange={(_, checked) => setEmptyWipeAcknowledged(checked)}
                disabled={isPending}
              />
            }
            label={`I understand this will remove all ${catalogTypeLabel} entries`}
          />
        )}

        {hasValidationErrors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Resolve validation errors before publishing. Entry IDs must be unique, and edited
            fields must match the catalog schema.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {publishFailureMessage(
              error,
              isConflictError,
              isAuthError,
              isForbiddenError,
              isBadRequestError,
            )}
          </Alert>
        )}

        {showConfirm && !error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }} gutterBottom>
              Are you sure you want to publish?
            </Typography>
            <Typography variant="body2">
              This will create a new immutable version. Published versions cannot be modified or
              deleted.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        {!showConfirm ? (
          <Button
            onClick={() => setShowConfirm(true)}
            variant="contained"
            disabled={isPending || !hasChanges || hasValidationErrors}
          >
            Review & Publish
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                setShowConfirm(false);
                setEmptyWipeAcknowledged(false);
              }}
              disabled={isPending}
            >
              Go Back
            </Button>
            <Button
              onClick={() => {
                void onPublish(releaseNotes).catch(() => {
                  // Mutation error is rendered by this dialog.
                });
              }}
              variant="contained"
              color="warning"
              disabled={
                isPending || hasValidationErrors || (isEmptyArrayPublish && !emptyWipeAcknowledged)
              }
              startIcon={isPending ? <CircularProgress size={16} /> : undefined}
            >
              {isPending ? 'Publishing...' : 'Confirm Publish'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
