import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import type { ElementDefinition } from '../../types/catalog';

interface ElementDetailProps {
  elementData: ElementDefinition | null;
}

export function ElementDetail({ elementData }: ElementDetailProps) {
  if (!elementData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select an element to view details
        </Typography>
      </Box>
    );
  }

  const strongAgainst = Object.entries(elementData.strongAgainst);
  const weakAgainst = Object.entries(elementData.weakAgainst);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: elementData.color,
            border: '2px solid',
            borderColor: 'divider',
          }}
        />
        <Typography variant="h5">
          {elementData.displayName}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {strongAgainst.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="success.main">
            Strong Against
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Element</TableCell>
                <TableCell align="right">Multiplier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {strongAgainst.map(([element, multiplier]) => (
                <TableRow key={element}>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{element}</TableCell>
                  <TableCell align="right">{(multiplier * 100).toFixed(0)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {weakAgainst.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom color="error.main">
            Weak Against
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Element</TableCell>
                <TableCell align="right">Multiplier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weakAgainst.map(([element, multiplier]) => (
                <TableRow key={element}>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{element}</TableCell>
                  <TableCell align="right">{(multiplier * 100).toFixed(0)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}
