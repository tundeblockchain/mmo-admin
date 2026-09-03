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
} from '@mui/material';
import type { CatalogType, CatalogEntityData } from '../../types/catalog';

interface DiffSummary {
  added: number;
  modified: number;
  removed: number;
  unchanged: number;
}

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
}

function getEntityId(entity: unknown, catalogType: CatalogType): string {
  const e = entity as Record<string, unknown>;
  switch (catalogType) {
    case 'class':
      return e.classId as string;
    case 'skill':
      return e.skillId as string;
    case 'status':
      return e.statusId as string;
    case 'element':
      return e.elementId as string;
    case 'resonance':
      return e.resonanceId as string;
    case 'combat-constants':
      return 'combat-constants';
  }
}

function computeDiffSummary(
  original: CatalogEntityData,
  draft: CatalogEntityData,
  catalogType: CatalogType,
): DiffSummary {
  if (catalogType === 'combat-constants') {
    const isModified = JSON.stringify(original) !== JSON.stringify(draft);
    return {
      added: 0,
      modified: isModified ? 1 : 0,
      removed: 0,
      unchanged: isModified ? 0 : 1,
    };
  }

  const originalArray = original as unknown[];
  const draftArray = draft as unknown[];

  const originalMap = new Map<string, string>();
  for (const item of originalArray) {
    const id = getEntityId(item, catalogType);
    originalMap.set(id, JSON.stringify(item));
  }

  const draftMap = new Map<string, string>();
  for (const item of draftArray) {
    const id = getEntityId(item, catalogType);
    draftMap.set(id, JSON.stringify(item));
  }

  let added = 0;
  let modified = 0;
  let removed = 0;
  let unchanged = 0;

  for (const [id, json] of draftMap) {
    const originalJson = originalMap.get(id);
    if (!originalJson) {
      added++;
    } else if (originalJson !== json) {
      modified++;
    } else {
      unchanged++;
    }
  }

  for (const id of originalMap.keys()) {
    if (!draftMap.has(id)) {
      removed++;
    }
  }

  return { added, modified, removed, unchanged };
}

function formatCatalogType(type: CatalogType): string {
  switch (type) {
    case 'combat-constants':
      return 'Combat Constants';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
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
}: PublishDialogProps) {
  const [releaseNotes, setReleaseNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const diffSummary = computeDiffSummary(originalData, draftData, catalogType);
  const hasChanges = diffSummary.added > 0 || diffSummary.modified > 0 || diffSummary.removed > 0;

  const handleReleaseNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReleaseNotes(event.target.value);
    },
    [],
  );

  const handleRequestPublish = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleConfirmPublish = useCallback(() => {
    void onPublish(releaseNotes);
  }, [onPublish, releaseNotes]);

  const handleClose = useCallback(() => {
    setReleaseNotes('');
    setShowConfirm(false);
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

        {error && !showConfirm && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {isConflictError
              ? 'Version conflict: Another version was published while you were editing. Please retry to publish as the next version.'
              : isAuthError
                ? 'Authentication required. Please sign in to publish.'
                : error.message}
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
            disabled={isPending || !hasChanges}
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
              disabled={isPending}
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
