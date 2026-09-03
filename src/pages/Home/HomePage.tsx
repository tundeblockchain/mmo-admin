import { Box, Paper, Typography } from '@mui/material';

export function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Welcome to the MMO Admin Control Panel.
        </Typography>
      </Paper>
    </Box>
  );
}
