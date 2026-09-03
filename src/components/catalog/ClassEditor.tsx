import { useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import type { ClassDefinition, ClassRole, PrimaryResource, ResonanceId } from '../../types/catalog';

interface ClassEditorProps {
  classData: ClassDefinition;
  onUpdate: (updated: ClassDefinition) => void;
}

const ROLES: ClassRole[] = ['tank', 'healer', 'dps', 'support'];
const RESOURCES: PrimaryResource[] = ['resolve', 'focus', 'mana', 'charge', 'radiance', 'momentum'];
const RESONANCES: ResonanceId[] = ['valor', 'precision', 'arcana', 'innovation', 'sanctuary', 'subterfuge'];

export function ClassEditor({ classData, onUpdate }: ClassEditorProps) {
  const handleTextChange = useCallback(
    (field: keyof ClassDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...classData, [field]: event.target.value });
    },
    [classData, onUpdate],
  );

  const handleResourceChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onUpdate({ ...classData, primaryResource: event.target.value as PrimaryResource });
    },
    [classData, onUpdate],
  );

  const handleResonanceChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      onUpdate({ ...classData, resonance: event.target.value as ResonanceId });
    },
    [classData, onUpdate],
  );

  const handleRoleToggle = useCallback(
    (role: ClassRole) => {
      const roles = classData.roles.includes(role)
        ? classData.roles.filter((r) => r !== role)
        : [...classData.roles, role];
      onUpdate({ ...classData, roles });
    },
    [classData, onUpdate],
  );

  const handleStatChange = useCallback(
    (statKey: keyof ClassDefinition['startingStats']) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value) || 0;
        onUpdate({
          ...classData,
          startingStats: { ...classData.startingStats, [statKey]: value },
        });
      },
    [classData, onUpdate],
  );

  const { startingStats } = classData;
  const primaryStats = [
    { key: 'strength' as const, label: 'Strength' },
    { key: 'finesse' as const, label: 'Finesse' },
    { key: 'vitality' as const, label: 'Vitality' },
    { key: 'intellect' as const, label: 'Intellect' },
    { key: 'precision' as const, label: 'Precision' },
    { key: 'luck' as const, label: 'Luck' },
    { key: 'tech' as const, label: 'Tech' },
  ];

  const derivedStats = [
    { key: 'hp' as const, label: 'HP' },
    { key: 'resourcePool' as const, label: 'Resource Pool' },
    { key: 'armor' as const, label: 'Armor' },
    { key: 'attackPower' as const, label: 'Attack Power' },
    { key: 'spellPower' as const, label: 'Spell Power' },
    { key: 'movementSpeed' as const, label: 'Movement Speed' },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Display Name"
          value={classData.displayName}
          onChange={handleTextChange('displayName')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={classData.description}
          onChange={handleTextChange('description')}
          fullWidth
          multiline
          rows={2}
          size="small"
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Primary Resource</InputLabel>
              <Select
                value={classData.primaryResource}
                label="Primary Resource"
                onChange={handleResourceChange}
              >
                {RESOURCES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Resonance</InputLabel>
              <Select
                value={classData.resonance}
                label="Resonance"
                onChange={handleResonanceChange}
              >
                {RESONANCES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Roles
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {ROLES.map((role) => (
            <Chip
              key={role}
              label={role}
              onClick={() => handleRoleToggle(role)}
              color={classData.roles.includes(role) ? 'primary' : 'default'}
              variant={classData.roles.includes(role) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
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
          <Grid container spacing={1}>
            {primaryStats.map((stat) => (
              <Grid size={6} key={stat.key}>
                <TextField
                  label={stat.label}
                  type="number"
                  value={startingStats[stat.key]}
                  onChange={handleStatChange(stat.key)}
                  size="small"
                  fullWidth
                  slotProps={{ htmlInput: { step: 1 } }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            Derived Stats
          </Typography>
          <Grid container spacing={1}>
            {derivedStats.map((stat) => (
              <Grid size={6} key={stat.key}>
                <TextField
                  label={stat.label}
                  type="number"
                  value={startingStats[stat.key]}
                  onChange={handleStatChange(stat.key)}
                  size="small"
                  fullWidth
                  slotProps={{ htmlInput: { step: stat.key === 'movementSpeed' ? 0.1 : 1 } }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
