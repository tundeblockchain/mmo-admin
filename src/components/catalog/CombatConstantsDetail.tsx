import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { CombatConstantsData } from '../../types/catalog';

interface CombatConstantsDetailProps {
  data: CombatConstantsData | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PERCENT_FIELDS = new Set([
  'baseCritChance',
  'maxLuckCritBonus',
  'criticalDamageMultiplier',
  'armorReductionPerPoint',
  'maxArmorReduction',
  'blockDamageReduction',
  'damageMultiplier',
  'healingMultiplier',
  'durationMultiplier',
  'staggerMultiplier',
  'globalDamageMultiplier',
  'globalHealingMultiplier',
  'ccDurationMultiplier',
  'executeThresholdModifier',
  'softCapPenalty',
  'baseDodgeChance',
  'maxDodgeChance',
  'outOfCombatHpRegen',
  'outOfCombatResourceRegen',
  'maxAccuracyBonus',
  'baseHitChance',
  'bonusPercent',
]);

function formatValue(value: unknown, key?: string): string {
  if (typeof value === 'number') {
    if (key && PERCENT_FIELDS.has(key)) {
      return `${(value * 100).toFixed(0)}%`;
    }
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(3).replace(/\.?0+$/, '');
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

function renderObject(obj: Record<string, unknown>, depth = 0): React.ReactNode {
  return (
    <Table size="small" sx={{ ml: depth * 2 }}>
      <TableBody>
        {Object.entries(obj).map(([key, value]) => {
          if (value === null || value === undefined) return null;
          
          const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
          
          if (typeof value === 'object' && !Array.isArray(value)) {
            return (
              <TableRow key={key}>
                <TableCell
                  colSpan={2}
                  sx={{ fontWeight: 'medium', textTransform: 'capitalize', pt: 2 }}
                >
                  {formattedKey}
                  {renderObject(value as Record<string, unknown>, depth + 1)}
                </TableCell>
              </TableRow>
            );
          }
          
          return (
            <TableRow key={key}>
              <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                {formattedKey}
              </TableCell>
              <TableCell align="right">{formatValue(value, key)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function CombatConstantsDetail({ data, isLoading, error }: CombatConstantsDetailProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load combat constants: {error.message}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info">
        Select a version to view combat constants.
      </Alert>
    );
  }

  const sections = [
    { key: 'powerScaling', label: 'Power Scaling', data: data.powerScaling },
    { key: 'critical', label: 'Critical', data: data.critical },
    { key: 'defense', label: 'Defense', data: data.defense },
    { key: 'speed', label: 'Speed', data: data.speed },
    { key: 'vitality', label: 'Vitality', data: data.vitality },
    { key: 'accuracy', label: 'Accuracy', data: data.accuracy },
    { key: 'glancingHit', label: 'Glancing Hit', data: data.glancingHit },
    { key: 'status', label: 'Status', data: data.status },
    { key: 'statCaps', label: 'Stat Caps', data: data.statCaps },
    { key: 'dodge', label: 'Dodge', data: data.dodge },
    { key: 'timing', label: 'Timing', data: data.timing },
    { key: 'stagger', label: 'Stagger', data: data.stagger },
    { key: 'pvp', label: 'PvP', data: data.pvp },
    { key: 'additionalConstants', label: 'Additional Constants', data: data.additionalConstants },
  ].filter((section) => section.data !== undefined);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Combat Constants
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Global combat math constants used by the game server for damage calculations, 
        critical hits, defense, and other combat mechanics.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {sections.map((section) => (
          <Grid size={12} key={section.key}>
            <Accordion defaultExpanded={section.key === 'powerScaling'}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{section.label}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderObject(section.data as Record<string, unknown>)}
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {data.statAllocationBands && data.statAllocationBands.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Stat Allocation Bands</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableBody>
                  {data.statAllocationBands.map((band, idx) => (
                    <TableRow key={idx}>
                      <TableCell>Level {band.minLevel}-{band.maxLevel}</TableCell>
                      <TableCell>{band.pointsPerLevel} points/level</TableCell>
                      <TableCell>{band.allocationCostPerPoint} cost/point</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Paper>
  );
}
