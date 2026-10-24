import { type ReactNode } from 'react';
import { Grid, Paper } from '@mui/material';

interface CatalogSplitPaneProps {
  list: ReactNode;
  detail: ReactNode;
}

export function CatalogSplitPane({ list, detail }: CatalogSplitPaneProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>{list}</Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>{detail}</Grid>
    </Grid>
  );
}
