import { type ReactNode } from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';

interface CatalogEditorLayoutProps {
  title: string;
  description?: string;
  headerAdornment?: ReactNode;
  children: ReactNode;
}

export function CatalogEditorLayout({
  title,
  description,
  headerAdornment,
  children,
}: CatalogEditorLayoutProps) {
  return (
    <Paper sx={{ p: 3 }}>
      {headerAdornment ? (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {headerAdornment}
          <Typography variant="h5">{title}</Typography>
        </Box>
      ) : (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}
      {description !== undefined && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      {description !== undefined && <Divider sx={{ my: 2 }} />}
      {children}
    </Paper>
  );
}
