import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { SkillDefinition } from '../../../types/catalog';
import { NumberField } from '../../form';

interface SkillPerStackValuesProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillPerStackValues({
  skillData,
  onUpdate,
  fieldErrors,
}: SkillPerStackValuesProps) {
  const coefficients = skillData.coefficients;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Per-Stack Values
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Index 0 is 1 stack. Values are posted as decimals.
      </Typography>
      {(coefficients.perStack?.basePowerPerStack ?? []).map((value, index) => (
        <Grid container spacing={2} key={`stack-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
          <Grid size={{ xs: 10, md: 6 }}>
            <NumberField
              label={`Stack ${index + 1} base power`}
              value={value}
              onChange={(next) => {
                const currentStacks = coefficients.perStack?.basePowerPerStack ?? [];
                const basePowerPerStack = [...currentStacks];
                basePowerPerStack[index] = next;
                onUpdate({
                  ...skillData,
                  coefficients: {
                    ...coefficients,
                    perStack: { ...coefficients.perStack, basePowerPerStack },
                  },
                });
              }}
              step={0.01}
              error={fieldErrors[`coefficients.perStack.basePowerPerStack.${index}`]}
            />
          </Grid>
          <Grid size={{ xs: 2 }}>
            <IconButton
              aria-label={`Remove stack ${index + 1}`}
              onClick={() => {
                const currentStacks = coefficients.perStack?.basePowerPerStack ?? [];
                const basePowerPerStack = currentStacks.filter((_, itemIndex) => itemIndex !== index);
                onUpdate({
                  ...skillData,
                  coefficients: {
                    ...coefficients,
                    perStack:
                      basePowerPerStack.length === 0
                        ? undefined
                        : { ...coefficients.perStack, basePowerPerStack },
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
        onClick={() => {
          const currentStacks = coefficients.perStack?.basePowerPerStack ?? [];
          onUpdate({
            ...skillData,
            coefficients: {
              ...coefficients,
              perStack: { ...coefficients.perStack, basePowerPerStack: [...currentStacks, 1] },
            },
          });
        }}
        size="small"
      >
        Add stack value
      </Button>
    </Box>
  );
}
