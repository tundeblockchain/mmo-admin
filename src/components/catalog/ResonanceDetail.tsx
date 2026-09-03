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
import type { ResonanceDefinition } from '../../types/catalog';

interface ResonanceDetailProps {
  resonanceData: ResonanceDefinition | null;
}

export function ResonanceDetail({ resonanceData }: ResonanceDetailProps) {
  if (!resonanceData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a resonance to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {resonanceData.displayName}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {resonanceData.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Party Bonuses
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Stat</TableCell>
            <TableCell align="right">Bonus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resonanceData.partyBonus.map((bonus, idx) => (
            <TableRow key={idx}>
              <TableCell sx={{ textTransform: 'capitalize' }}>
                {bonus.stat.replace(/([A-Z])/g, ' $1').trim()}
              </TableCell>
              <TableCell align="right">
                +{(bonus.bonusPercent * 100).toFixed(0)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
