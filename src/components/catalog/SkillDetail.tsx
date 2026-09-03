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
import type { SkillDefinition } from '../../types/catalog';

interface SkillDetailProps {
  skillData: SkillDefinition | null;
}

export function SkillDetail({ skillData }: SkillDetailProps) {
  if (!skillData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a skill to view details
        </Typography>
      </Box>
    );
  }

  const basicInfo = [
    { label: 'Class', value: skillData.classId },
    { label: 'Kind', value: skillData.kind },
    { label: 'Unlock Level', value: skillData.unlockLevel },
    { label: 'Range', value: skillData.range === 0 ? 'Melee/Self' : `${skillData.range}` },
    { label: 'Resource Cost', value: skillData.resourceCost === 0 ? 'None' : `${skillData.resourceCost} ${skillData.resourceId ?? ''}` },
    { label: 'Cooldown', value: skillData.cooldownSeconds === 0 ? 'None' : `${skillData.cooldownSeconds}s` },
    { label: 'Charges', value: skillData.charges },
    { label: 'Cast Time', value: skillData.castTimeSeconds === 0 ? 'Instant' : `${skillData.castTimeSeconds}s` },
    { label: 'Castable While Moving', value: skillData.castableWhileMoving ? 'Yes' : 'No' },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {skillData.displayName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={skillData.kind} color="primary" size="small" />
          {skillData.coefficients.element && (
            <Chip label={skillData.coefficients.element} size="small" />
          )}
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {skillData.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Basic Info
          </Typography>
          <Table size="small">
            <TableBody>
              {basicInfo.map((item) => (
                <TableRow key={item.label}>
                  <TableCell component="th" scope="row">
                    {item.label}
                  </TableCell>
                  <TableCell align="right">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Coefficients
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Base Power
                </TableCell>
                <TableCell align="right">{skillData.coefficients.basePower}</TableCell>
              </TableRow>
              {skillData.coefficients.scaling.map((scale, idx) => (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row">
                    {scale.stat}
                  </TableCell>
                  <TableCell align="right">{scale.coefficient}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        {skillData.timing && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Timing (ms)
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">Cast</TableCell>
                  <TableCell align="right">{skillData.timing.castMs}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Active</TableCell>
                  <TableCell align="right">{skillData.timing.activeMs}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Recovery</TableCell>
                  <TableCell align="right">{skillData.timing.recoveryMs}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        )}

        {skillData.stagger && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Stagger
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">Stagger Power</TableCell>
                  <TableCell align="right">{skillData.stagger.staggerPower}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Can Stagger</TableCell>
                  <TableCell align="right">{skillData.stagger.canStagger ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        )}

        {skillData.pvpMultipliers && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              PvP Multipliers
            </Typography>
            <Table size="small">
              <TableBody>
                {skillData.pvpMultipliers.damageMultiplier !== undefined && (
                  <TableRow>
                    <TableCell component="th" scope="row">Damage Multiplier</TableCell>
                    <TableCell align="right">{(skillData.pvpMultipliers.damageMultiplier * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                )}
                {skillData.pvpMultipliers.healingMultiplier !== undefined && (
                  <TableRow>
                    <TableCell component="th" scope="row">Healing Multiplier</TableCell>
                    <TableCell align="right">{(skillData.pvpMultipliers.healingMultiplier * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
