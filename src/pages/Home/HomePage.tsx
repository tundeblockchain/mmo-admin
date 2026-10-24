import { Box, Paper, Typography } from '@mui/material';

export function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Dashboard
      </Typography>
      <Paper
        sx={(theme) => ({
          p: 3,
          backgroundImage: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
        })}
      >
        <Typography variant="body1">
          Welcome to the MMO Admin Control Panel.
        </Typography>
      </Paper>
    </Box>
  );
}
