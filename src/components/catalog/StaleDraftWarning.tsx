import { Alert, AlertTitle, Box, Button } from '@mui/material';

interface StaleDraftWarningProps {
  sourceVersion: number;
  latestVersion: number;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export function StaleDraftWarning({
  sourceVersion,
  latestVersion,
  onKeepEditing,
  onDiscard,
}: StaleDraftWarningProps) {
  return (
    <Alert
      severity="warning"
      role="alert"
      aria-label="Draft is based on an older version"
      sx={{ mb: 2 }}
    >
      <AlertTitle>Draft is based on an older version</AlertTitle>
      This draft is based on version {sourceVersion}, but version {latestVersion}{' '}
      is now the latest published version. Publishing would build on an older
      version. The newer catalog was not merged.
      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Button variant="outlined" color="inherit" size="small" onClick={onKeepEditing}>
          Keep editing
        </Button>
        <Button variant="contained" color="warning" size="small" onClick={onDiscard}>
          Discard draft
        </Button>
      </Box>
    </Alert>
  );
}
