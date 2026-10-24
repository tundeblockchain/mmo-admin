import { Button, Checkbox, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { ResourceEffect, SkillDefinition } from '../../../types/catalog';
import { EditorAccordion, NumberField, OptionalNumberField } from '../../form';
import { createResourceEffect } from './skillFactories';

interface SkillResourceEffectsSectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillResourceEffectsSection({
  skillData,
  onUpdate,
  fieldErrors,
}: SkillResourceEffectsSectionProps) {
  const updateEffect = (index: number, next: ResourceEffect) => {
    const resourceEffects = [...(skillData.resourceEffects ?? [])];
    resourceEffects[index] = next;
    onUpdate({ ...skillData, resourceEffects });
  };

  return (
    <EditorAccordion title="Resource Effects">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Generation and consumption effects. Amount is a decimal; check percent-of-max to treat
        it as a fraction of the resource pool (0.10 = 10%).
      </Typography>
      {(skillData.resourceEffects ?? []).map((effect, index) => (
        <Grid
          container
          spacing={2}
          key={`resource-effect-${index}`}
          sx={{ mb: 1, alignItems: 'center' }}
        >
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Resource ID"
              value={effect.resourceId}
              onChange={(event) =>
                updateEffect(index, { ...effect, resourceId: event.target.value })
              }
              size="small"
              fullWidth
              error={fieldErrors[`resourceEffects.${index}.resourceId`] !== undefined}
              helperText={fieldErrors[`resourceEffects.${index}.resourceId`]}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <NumberField
              label="Amount"
              value={effect.amount}
              onChange={(value) => updateEffect(index, { ...effect, amount: value })}
              step={0.1}
              error={fieldErrors[`resourceEffects.${index}.amount`]}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <OptionalNumberField
              label="Per-Target Bonus"
              value={effect.perTargetBonus}
              onChange={(value) => updateEffect(index, { ...effect, perTargetBonus: value })}
              step={0.1}
              error={fieldErrors[`resourceEffects.${index}.perTargetBonus`]}
            />
          </Grid>
          <Grid size={{ xs: 8, sm: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={effect.isPercentOfMax}
                  onChange={(_, checked) =>
                    updateEffect(index, { ...effect, isPercentOfMax: checked })
                  }
                />
              }
              label="Percent of max"
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 1 }}>
            <IconButton
              aria-label={`Remove resource effect ${index + 1}`}
              onClick={() => {
                const resourceEffects = (skillData.resourceEffects ?? []).filter(
                  (_, itemIndex) => itemIndex !== index,
                );
                onUpdate({
                  ...skillData,
                  resourceEffects: resourceEffects.length === 0 ? undefined : resourceEffects,
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
            ...skillData,
            resourceEffects: [...(skillData.resourceEffects ?? []), createResourceEffect()],
          })
        }
        size="small"
      >
        Add resource effect
      </Button>
    </EditorAccordion>
  );
}
