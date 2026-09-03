import { Box, Paper, Typography } from '@mui/material';

export function CatalogPage() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Catalog
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Catalog management coming soon.
        </Typography>
      </Paper>
    </Box>
  );
}
