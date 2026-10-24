import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Alert,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import type { CatalogType, CatalogEntityData } from '../../types/catalog';
import { computeDiffSummary } from '../../lib/catalogDiff';
import { AdminForbiddenError, ApiError } from '../../lib/errors';

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

function formatCatalogType(type: CatalogType): string {
  switch (type) {
    case 'combat-constants':
      return 'Combat Constants';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

function isEmptyArrayCatalog(catalogType: CatalogType, draftData: CatalogEntityData): boolean {
  return catalogType !== 'combat-constants' && Array.isArray(draftData) && draftData.length === 0;
}

export const ADMIN_FORBIDDEN_PUBLISH_MESSAGE =
  "Your account isn't an admin, so it can't publish catalogs.";

export const BAD_REQUEST_PUBLISH_MESSAGE =
  'The server rejected this catalog. An empty data array cannot be published.';

function publishFailureMessage(
  error: Error,
  isConflictError: boolean,
  isAuthError: boolean,
  isForbiddenError: boolean,
  isBadRequestError: boolean,
): string {
  if (isConflictError) {
    return 'Version conflict: Another version was published while you were editing. Please retry to publish as the next version.';
  }

  if (isAuthError) {
    return 'Authentication required. Please sign in to publish.';
  }

  if (isForbiddenError || error instanceof AdminForbiddenError) {
    return ADMIN_FORBIDDEN_PUBLISH_MESSAGE;
  }

  if (isBadRequestError || (error instanceof ApiError && error.status === 400)) {
    return BAD_REQUEST_PUBLISH_MESSAGE;
  }

  return error.message;
}

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

  const diffSummary = computeDiffSummary(originalData, draftData, catalogType);
  const hasChanges = diffSummary.added > 0 || diffSummary.modified > 0 || diffSummary.removed > 0;
  const isEmptyArrayPublish = isEmptyArrayCatalog(catalogType, draftData);
  const catalogTypeLabel = formatCatalogType(catalogType).toLowerCase();

  const handleReleaseNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReleaseNotes(event.target.value);
    },
    [],
  );

  const handleRequestPublish = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleEmptyWipeAckChange = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setEmptyWipeAcknowledged(checked);
    },
    [],
  );

  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(false);
    setEmptyWipeAcknowledged(false);
  }, []);

  const handleConfirmPublish = useCallback(() => {
    void onPublish(releaseNotes).catch(() => {
      // Mutation error is rendered by this dialog.
    });
  }, [onPublish, releaseNotes]);

  const handleClose = useCallback(() => {
    setReleaseNotes('');
    setShowConfirm(false);
    setEmptyWipeAcknowledged(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Publish {formatCatalogType(catalogType)} Catalog
      </DialogTitle>
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

        <Divider sx={{ my: 2 }} />

        <TextField
          label="Release Notes (optional)"
          multiline
          rows={3}
          fullWidth
          value={releaseNotes}
          onChange={handleReleaseNotesChange}
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
                onChange={handleEmptyWipeAckChange}
                disabled={isPending}
              />
            }
            label={`I understand this will remove all ${catalogTypeLabel} entries`}
          />
        )}

        {hasValidationErrors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Resolve invalid entry IDs before publishing. Each ID must be non-empty and unique
            within this draft.
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
            onClick={handleRequestPublish}
            variant="contained"
            disabled={isPending || !hasChanges || hasValidationErrors}
          >
            Review & Publish
          </Button>
        ) : (
          <>
            <Button onClick={handleCancelConfirm} disabled={isPending}>
              Go Back
            </Button>
            <Button
              onClick={handleConfirmPublish}
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
