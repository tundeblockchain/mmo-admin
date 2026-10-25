import { Box, Button, Chip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import CancelIcon from '@mui/icons-material/Cancel';
import type { CatalogType } from '../../types/catalog';
import { formatCatalogType } from '../../lib/catalogLabels';

interface DraftToolbarProps {
  catalogType: CatalogType;
  currentVersion: number | null;
  hasDraft: boolean;
  isDraftDirty: boolean;
  draftSourceVersion: number | null;
  onCreateDraft: () => void;
  onDiscardDraft: () => void;
  onOpenPublish: () => void;
  isCreatingDraft: boolean;
  hasValidationErrors?: boolean;
  canPublish?: boolean;
}

export function DraftToolbar({
  catalogType,
  currentVersion,
  hasDraft,
  isDraftDirty,
  draftSourceVersion,
  onCreateDraft,
  onDiscardDraft,
  onOpenPublish,
  isCreatingDraft,
  hasValidationErrors = false,
  canPublish = false,
}: DraftToolbarProps) {
  if (!hasDraft) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onCreateDraft}
          disabled={currentVersion === null || isCreatingDraft}
          size="small"
        >
          {isCreatingDraft ? 'Creating Draft...' : 'Edit as Draft'}
        </Button>
        {currentVersion !== null && (
          <Typography variant="caption" color="text.secondary">
            Viewing published version {currentVersion} (read-only)
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <Chip
        label={
          draftSourceVersion !== null && draftSourceVersion > 0
            ? `Editing Draft (from v${draftSourceVersion})`
            : 'Editing Draft (new catalog)'
        }
        color="warning"
        size="small"
      />
      {isDraftDirty && (
        <Chip label="Unsaved changes" color="info" size="small" variant="outlined" />
      )}
      <Box sx={{ flexGrow: 1 }} />
      <Button
        variant="outlined"
        color="error"
        startIcon={<CancelIcon />}
        onClick={onDiscardDraft}
        size="small"
      >
        Discard Draft
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PublishIcon />}
        onClick={onOpenPublish}
        size="small"
        disabled={hasValidationErrors || !canPublish}
      >
        Publish {formatCatalogType(catalogType)}
      </Button>
    </Box>
  );
}
