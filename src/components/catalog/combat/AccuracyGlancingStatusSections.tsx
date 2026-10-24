import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion, OptionalNumberField, OptionalPercentField } from '../../form';

interface AccuracyGlancingStatusSectionsProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function AccuracyGlancingStatusSections({
  data,
  onUpdate,
  fieldErrors,
}: AccuracyGlancingStatusSectionsProps) {
  const patch = (updater: (current: CombatConstantsData) => CombatConstantsData) => {
    onUpdate(updater(data));
  };

  return (
    <>
      <EditorAccordion title="Accuracy">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Base Hit Chance"
              value={data.accuracy?.baseHitChance}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  accuracy: { ...current.accuracy, baseHitChance: value },
                }))
              }
              error={fieldErrors['accuracy.baseHitChance']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Precision Constant"
              value={data.accuracy?.accuracyBonus?.precisionConstant}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  accuracy: {
                    ...current.accuracy,
                    accuracyBonus: {
                      ...current.accuracy?.accuracyBonus,
                      precisionConstant: value,
                    },
                  },
                }))
              }
              error={fieldErrors['accuracy.accuracyBonus.precisionConstant']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Max Accuracy Bonus"
              value={data.accuracy?.accuracyBonus?.maxAccuracyBonus}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  accuracy: {
                    ...current.accuracy,
                    accuracyBonus: {
                      ...current.accuracy?.accuracyBonus,
                      maxAccuracyBonus: value,
                    },
                  },
                }))
              }
              error={fieldErrors['accuracy.accuracyBonus.maxAccuracyBonus']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Weak Point Precision Multiplier"
              value={data.accuracy?.weakPoint?.precisionMultiplier}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  accuracy: {
                    ...current.accuracy,
                    weakPoint: { ...current.accuracy?.weakPoint, precisionMultiplier: value },
                  },
                }))
              }
              step={0.0001}
              error={fieldErrors['accuracy.weakPoint.precisionMultiplier']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>

      <EditorAccordion title="Glancing Hit">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Damage Multiplier"
              value={data.glancingHit?.damageMultiplier}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  glancingHit: { ...current.glancingHit, damageMultiplier: value },
                }))
              }
              error={fieldErrors['glancingHit.damageMultiplier']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.glancingHit?.canCrit ?? false}
                  onChange={(_, checked) =>
                    patch((current) => ({
                      ...current,
                      glancingHit: { ...current.glancingHit, canCrit: checked },
                    }))
                  }
                />
              }
              label="Can Crit"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.glancingHit?.canStagger ?? false}
                  onChange={(_, checked) =>
                    patch((current) => ({
                      ...current,
                      glancingHit: { ...current.glancingHit, canStagger: checked },
                    }))
                  }
                />
              }
              label="Can Stagger"
            />
          </Grid>
        </Grid>
      </EditorAccordion>

      <EditorAccordion title="Status">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Resistance Constant"
              value={data.status?.resistanceConstant}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  status: { ...current.status, resistanceConstant: value },
                }))
              }
              error={fieldErrors['status.resistanceConstant']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>
    </>
  );
}
