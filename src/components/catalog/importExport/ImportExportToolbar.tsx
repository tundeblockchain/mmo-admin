import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PublishIcon from '@mui/icons-material/Publish';

interface ImportExportToolbarProps {
  canPublishAll: boolean;
  dirtyCount: number;
  onImport: () => void;
  onExport: () => void;
  onPublishAll: () => void;
}

export function ImportExportToolbar({
  canPublishAll,
  dirtyCount,
  onImport,
  onExport,
  onPublishAll,
}: ImportExportToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        flexWrap: 'wrap',
      }}
    >
      <Button variant="outlined" size="small" startIcon={<FileUploadIcon />} onClick={onImport}>
        Import JSON
      </Button>
      <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />} onClick={onExport}>
        Export JSON
      </Button>
      <Button
        variant="contained"
        size="small"
        color="warning"
        startIcon={<PublishIcon />}
        onClick={onPublishAll}
        disabled={!canPublishAll}
      >
        Publish all drafts{dirtyCount > 0 ? ` (${dirtyCount})` : ''}
      </Button>
    </Box>
  );
}
