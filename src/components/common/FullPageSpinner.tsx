import { Box, CircularProgress } from '@mui/material';

interface FullPageSpinnerProps {
  label: string;
}

export function FullPageSpinner({ label }: FullPageSpinnerProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="status"
      aria-label={label}
    >
      <CircularProgress />
    </Box>
  );
}
