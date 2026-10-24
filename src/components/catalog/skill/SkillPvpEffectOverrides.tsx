import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { PvPMultipliers } from '../../../types/catalog';
import { NumberField } from '../../form';

interface SkillPvpEffectOverridesProps {
  pvpMultipliers: PvPMultipliers;
  onUpdate: (next: PvPMultipliers) => void;
  fieldErrors: FieldErrors;
}

export function SkillPvpEffectOverrides({
  pvpMultipliers,
  onUpdate,
  fieldErrors,
}: SkillPvpEffectOverridesProps) {
  const effectOverrides = Object.entries(pvpMultipliers.effectOverrides ?? {});

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Effect Overrides
      </Typography>
      {effectOverrides.map(([key, value], index) => (
        <Grid container spacing={2} key={`effect-override-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
          <Grid size={{ xs: 5 }}>
            <TextField
              label="Override Key"
              value={key}
              onChange={(event) => {
                const nextOverrides = { ...pvpMultipliers.effectOverrides };
                delete nextOverrides[key];
                if (event.target.value !== '' || key !== '') {
                  nextOverrides[event.target.value] = value;
                }
                onUpdate({ ...pvpMultipliers, effectOverrides: nextOverrides });
              }}
              size="small"
              fullWidth
              error={key.trim() === '' && fieldErrors['pvpMultipliers.effectOverrides.key'] !== undefined}
              helperText={key.trim() === '' ? fieldErrors['pvpMultipliers.effectOverrides.key'] : undefined}
            />
          </Grid>
          <Grid size={{ xs: 5 }}>
            <NumberField
              label="Override Value"
              value={value}
              onChange={(next) => {
                const nextOverrides = { ...pvpMultipliers.effectOverrides, [key]: next };
                onUpdate({ ...pvpMultipliers, effectOverrides: nextOverrides });
              }}
              step={0.01}
              error={fieldErrors[`pvpMultipliers.effectOverrides.${key}`]}
            />
          </Grid>
          <Grid size={{ xs: 2 }}>
            <IconButton
              aria-label={`Remove effect override ${key || index + 1}`}
              onClick={() => {
                const nextOverrides = { ...pvpMultipliers.effectOverrides };
                delete nextOverrides[key];
                onUpdate({
                  ...pvpMultipliers,
                  effectOverrides:
                    Object.keys(nextOverrides).length === 0 ? undefined : nextOverrides,
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          onUpdate({
            ...pvpMultipliers,
            effectOverrides: { ...pvpMultipliers.effectOverrides, '': 0 },
          })
        }
        size="small"
      >
        Add effect override
      </Button>
    </Box>
  );
}
