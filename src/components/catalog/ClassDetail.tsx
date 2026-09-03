import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import type { ClassDefinition } from '../../types/catalog';

interface ClassDetailProps {
  classData: ClassDefinition | null;
}

export function ClassDetail({ classData }: ClassDetailProps) {
  if (!classData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a class to view details
        </Typography>
      </Box>
    );
  }

  const { startingStats } = classData;
  const primaryStats = [
    { label: 'Strength', value: startingStats.strength },
    { label: 'Finesse', value: startingStats.finesse },
    { label: 'Vitality', value: startingStats.vitality },
    { label: 'Intellect', value: startingStats.intellect },
    { label: 'Precision', value: startingStats.precision },
    { label: 'Luck', value: startingStats.luck },
    { label: 'Tech', value: startingStats.tech },
  ];

  const derivedStats = [
    { label: 'HP', value: startingStats.hp },
    { label: 'Resource Pool', value: startingStats.resourcePool },
    { label: 'Armor', value: startingStats.armor },
    { label: 'Attack Power', value: startingStats.attackPower },
    { label: 'Spell Power', value: startingStats.spellPower },
    { label: 'Movement Speed', value: startingStats.movementSpeed },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {classData.displayName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {classData.roles.map((role) => (
            <Chip key={role} label={role} color="primary" size="small" />
          ))}
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {classData.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2">
            <strong>Primary Resource:</strong> {classData.primaryResource}
          </Typography>
          {classData.secondaryResource && (
            <Typography variant="body2">
              <strong>Secondary Resource:</strong> {classData.secondaryResource}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Resonance:</strong> {classData.resonance}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Starting Stats
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            Primary Stats
          </Typography>
          <Table size="small">
            <TableBody>
              {primaryStats.map((stat) => (
                <TableRow key={stat.label}>
                  <TableCell component="th" scope="row">
                    {stat.label}
                  </TableCell>
                  <TableCell align="right">{stat.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            Derived Stats
          </Typography>
          <Table size="small">
            <TableBody>
              {derivedStats.map((stat) => (
                <TableRow key={stat.label}>
                  <TableCell component="th" scope="row">
                    {stat.label}
                  </TableCell>
                  <TableCell align="right">{stat.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
}
