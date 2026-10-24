import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SKILL_CONDITIONS } from '../../../lib/catalogSchema';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { SkillCondition, SkillDefinition } from '../../../types/catalog';
import { OptionalNumberField, OptionalPercentField, SelectField } from '../../form';
import { createConditional } from './skillFactories';

interface SkillConditionalsBlockProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillConditionalsBlock({
  skillData,
  onUpdate,
  fieldErrors,
}: SkillConditionalsBlockProps) {
  const coefficients = skillData.coefficients;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Conditionals
      </Typography>
      {(coefficients.conditionals ?? []).map((conditional, index) => (
        <Grid container spacing={2} key={`conditional-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SelectField
              label="Condition"
              labelId={`conditional-${index}-label`}
              value={conditional.condition}
              onChange={(value) => {
                const conditionals = [...(coefficients.conditionals ?? [])];
                conditionals[index] = { ...conditional, condition: value as SkillCondition };
                onUpdate({ ...skillData, coefficients: { ...coefficients, conditionals } });
              }}
              options={SKILL_CONDITIONS}
              error={fieldErrors[`coefficients.conditionals.${index}.condition`] !== undefined}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 2 }}>
            <OptionalPercentField
              label="Threshold"
              value={conditional.threshold}
              onChange={(value) => {
                const conditionals = [...(coefficients.conditionals ?? [])];
                conditionals[index] = { ...conditional, threshold: value };
                onUpdate({ ...skillData, coefficients: { ...coefficients, conditionals } });
              }}
              error={fieldErrors[`coefficients.conditionals.${index}.threshold`]}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 2 }}>
            <OptionalNumberField
              label="Base Power"
              value={conditional.basePower}
              onChange={(value) => {
                const conditionals = [...(coefficients.conditionals ?? [])];
                conditionals[index] = { ...conditional, basePower: value };
                onUpdate({ ...skillData, coefficients: { ...coefficients, conditionals } });
              }}
              step={0.01}
              error={fieldErrors[`coefficients.conditionals.${index}.basePower`]}
            />
          </Grid>
          <Grid size={{ xs: 10, sm: 3 }}>
            <OptionalNumberField
              label="Damage Multiplier"
              value={conditional.damageMultiplier}
              onChange={(value) => {
                const conditionals = [...(coefficients.conditionals ?? [])];
                conditionals[index] = { ...conditional, damageMultiplier: value };
                onUpdate({ ...skillData, coefficients: { ...coefficients, conditionals } });
              }}
              step={0.01}
              error={fieldErrors[`coefficients.conditionals.${index}.damageMultiplier`]}
            />
          </Grid>
          <Grid size={{ xs: 2, sm: 1 }}>
            <IconButton
              aria-label={`Remove conditional ${index + 1}`}
              onClick={() => {
                const conditionals = (coefficients.conditionals ?? []).filter(
                  (_, itemIndex) => itemIndex !== index,
                );
                onUpdate({
                  ...skillData,
                  coefficients: {
                    ...coefficients,
                    conditionals: conditionals.length === 0 ? undefined : conditionals,
                  },
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
            coefficients: {
              ...coefficients,
              conditionals: [...(coefficients.conditionals ?? []), createConditional()],
            },
          })
        }
        size="small"
      >
        Add conditional
      </Button>
    </Box>
  );
}
