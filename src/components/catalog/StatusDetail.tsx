import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import type { StatusDefinition } from '../../types/catalog';

const CATEGORY_COLORS: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  buff: 'success',
  debuff: 'error',
  dot: 'warning',
  hot: 'info',
  control: 'default',
};

interface StatusDetailProps {
  statusData: StatusDefinition | null;
}

export function StatusDetail({ statusData }: StatusDetailProps) {
  if (!statusData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a status to view details
        </Typography>
      </Box>
    );
  }

  const info = [
    { label: 'Category', value: statusData.category },
    { label: 'Max Stacks', value: statusData.maxStacks },
    { label: 'Dispellable', value: statusData.dispellable ? 'Yes' : 'No' },
    { label: 'Persists Through Death', value: statusData.persistsThroughDeath ? 'Yes' : 'No' },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {statusData.displayName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={statusData.category}
            color={CATEGORY_COLORS[statusData.category]}
            size="small"
          />
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {statusData.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      <Table size="small">
        <TableBody>
          {info.map((item) => (
            <TableRow key={item.label}>
              <TableCell component="th" scope="row">
                {item.label}
              </TableCell>
              <TableCell align="right">{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
