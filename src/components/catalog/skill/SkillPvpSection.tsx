import { Grid, TextField, Typography } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { PvPMultipliers, SkillDefinition } from '../../../types/catalog';
import { EditorAccordion, NumberField, OptionalNumberField, OptionalPercentField, PercentField } from '../../form';
import { SkillPvpEffectOverrides } from './SkillPvpEffectOverrides';

interface SkillPvpSectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillPvpSection({ skillData, onUpdate, fieldErrors }: SkillPvpSectionProps) {
  const pvpMultipliers = skillData.pvpMultipliers ?? {};

  const updatePvp = (next: PvPMultipliers) => {
    onUpdate({ ...skillData, pvpMultipliers: next });
  };

  return (
    <EditorAccordion title="PvP Multipliers">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Multipliers applied to this skill in PvP. Values are stored as decimals (e.g., 0.80 = 80%).
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Damage Multiplier"
            value={pvpMultipliers.damageMultiplier ?? 1}
            onChange={(value) => updatePvp({ ...pvpMultipliers, damageMultiplier: value })}
            error={fieldErrors['pvpMultipliers.damageMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Healing Multiplier"
            value={pvpMultipliers.healingMultiplier ?? 1}
            onChange={(value) => updatePvp({ ...pvpMultipliers, healingMultiplier: value })}
            error={fieldErrors['pvpMultipliers.healingMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Duration Multiplier"
            value={pvpMultipliers.durationMultiplier ?? 1}
            onChange={(value) => updatePvp({ ...pvpMultipliers, durationMultiplier: value })}
            error={fieldErrors['pvpMultipliers.durationMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Cooldown Multiplier"
            value={pvpMultipliers.cooldownMultiplier ?? 1}
            onChange={(value) => updatePvp({ ...pvpMultipliers, cooldownMultiplier: value })}
            error={fieldErrors['pvpMultipliers.cooldownMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Duration (seconds)"
            value={pvpMultipliers.durationSeconds}
            onChange={(value) => updatePvp({ ...pvpMultipliers, durationSeconds: value })}
            step={0.1}
            error={fieldErrors['pvpMultipliers.durationSeconds']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Cooldown (seconds)"
            value={pvpMultipliers.cooldownSeconds}
            onChange={(value) => updatePvp({ ...pvpMultipliers, cooldownSeconds: value })}
            step={0.1}
            error={fieldErrors['pvpMultipliers.cooldownSeconds']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalPercentField
            label="Stagger Multiplier"
            value={pvpMultipliers.staggerMultiplier}
            onChange={(value) => updatePvp({ ...pvpMultipliers, staggerMultiplier: value })}
            error={fieldErrors['pvpMultipliers.staggerMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Max Targets"
            value={pvpMultipliers.maxTargets}
            onChange={(value) => updatePvp({ ...pvpMultipliers, maxTargets: value })}
            error={fieldErrors['pvpMultipliers.maxTargets']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Max Hits Per Target"
            value={pvpMultipliers.maxHitsPerTarget}
            onChange={(value) => updatePvp({ ...pvpMultipliers, maxHitsPerTarget: value })}
            error={fieldErrors['pvpMultipliers.maxHitsPerTarget']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            label="Resource Override ID"
            value={pvpMultipliers.resourceOverride?.resourceId ?? ''}
            onChange={(event) =>
              updatePvp({
                ...pvpMultipliers,
                resourceOverride: {
                  resourceId: event.target.value,
                  amount: pvpMultipliers.resourceOverride?.amount ?? 0,
                },
              })
            }
            size="small"
            fullWidth
            error={fieldErrors['pvpMultipliers.resourceOverride.resourceId'] !== undefined}
            helperText={fieldErrors['pvpMultipliers.resourceOverride.resourceId']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Resource Override Amount"
            value={pvpMultipliers.resourceOverride?.amount ?? 0}
            onChange={(value) =>
              updatePvp({
                ...pvpMultipliers,
                resourceOverride: {
                  resourceId: pvpMultipliers.resourceOverride?.resourceId ?? '',
                  amount: value,
                },
              })
            }
            error={fieldErrors['pvpMultipliers.resourceOverride.amount']}
          />
        </Grid>
      </Grid>

      <SkillPvpEffectOverrides
        pvpMultipliers={pvpMultipliers}
        onUpdate={updatePvp}
        fieldErrors={fieldErrors}
      />
    </EditorAccordion>
  );
}
