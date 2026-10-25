import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SCALING_STATS } from '../../../lib/catalogSchema';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { ScalingStat, SkillDefinition } from '../../../types/catalog';
import {
  CatalogReferenceSelect,
  EditorAccordion,
  NumberField,
  OptionalNumberField,
  SelectField,
} from '../../form';
import { SkillConditionalsBlock } from './SkillConditionalsBlock';
import { SkillPerStackValues } from './SkillPerStackValues';
import { createScaling } from './skillFactories';

interface SkillCoefficientsSectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillCoefficientsSection({
  skillData,
  onUpdate,
  fieldErrors,
}: SkillCoefficientsSectionProps) {
  const coefficients = skillData.coefficients;

  return (
    <EditorAccordion title="Coefficients">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Base Power"
            value={coefficients.basePower}
            onChange={(value) =>
              onUpdate({ ...skillData, coefficients: { ...coefficients, basePower: value } })
            }
            error={fieldErrors['coefficients.basePower']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <CatalogReferenceSelect
            catalogType="element"
            label="Element"
            labelId="skill-element-label"
            value={coefficients.element ?? ''}
            onChange={(value) =>
              onUpdate({
                ...skillData,
                coefficients: {
                  ...coefficients,
                  element: value === '' ? undefined : value,
                },
              })
            }
            includeEmpty
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <CatalogReferenceSelect
            catalogType="status"
            label="Applies Status"
            labelId="skill-applies-status-label"
            value={coefficients.appliesStatus ?? ''}
            onChange={(value) =>
              onUpdate({
                ...skillData,
                coefficients: {
                  ...coefficients,
                  appliesStatus: value === '' ? undefined : value,
                },
              })
            }
            includeEmpty
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Effect Duration (seconds)"
            value={coefficients.effectDuration}
            onChange={(value) =>
              onUpdate({ ...skillData, coefficients: { ...coefficients, effectDuration: value } })
            }
            step={0.1}
            error={fieldErrors['coefficients.effectDuration']}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Scaling
        </Typography>
        {coefficients.scaling.map((scale, index) => (
          <Grid container spacing={2} key={`scaling-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
            <Grid size={{ xs: 6, md: 5 }}>
              <SelectField
                label="Stat"
                labelId={`scaling-stat-${index}-label`}
                value={scale.stat}
                onChange={(value) => {
                  const scaling = [...coefficients.scaling];
                  scaling[index] = { ...scaling[index], stat: value as ScalingStat };
                  onUpdate({ ...skillData, coefficients: { ...coefficients, scaling } });
                }}
                options={SCALING_STATS}
              />
            </Grid>
            <Grid size={{ xs: 5, md: 5 }}>
              <NumberField
                label="Coefficient"
                value={scale.coefficient}
                onChange={(value) => {
                  const scaling = [...coefficients.scaling];
                  scaling[index] = { ...scaling[index], coefficient: value };
                  onUpdate({ ...skillData, coefficients: { ...coefficients, scaling } });
                }}
                step={0.01}
                error={fieldErrors[`coefficients.scaling.${index}.coefficient`]}
              />
            </Grid>
            <Grid size={{ xs: 1 }}>
              <IconButton
                aria-label={`Remove scaling ${scale.stat}`}
                onClick={() =>
                  onUpdate({
                    ...skillData,
                    coefficients: {
                      ...coefficients,
                      scaling: coefficients.scaling.filter((_, itemIndex) => itemIndex !== index),
                    },
                  })
                }
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
              coefficients: { ...coefficients, scaling: [...coefficients.scaling, createScaling()] },
            })
          }
          size="small"
        >
          Add scaling
        </Button>
      </Box>

      <SkillPerStackValues skillData={skillData} onUpdate={onUpdate} fieldErrors={fieldErrors} />

      <SkillConditionalsBlock skillData={skillData} onUpdate={onUpdate} fieldErrors={fieldErrors} />
    </EditorAccordion>
  );
}
