import { Grid, Typography } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData, PowerScalingConstants } from '../../../types/catalog';
import { EditorAccordion, NumberField } from '../../form';

interface PowerScalingSectionProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function PowerScalingSection({ data, onUpdate, fieldErrors }: PowerScalingSectionProps) {
  const updateScaling = (updated: PowerScalingConstants) => {
    onUpdate({ ...data, powerScaling: updated });
  };

  return (
    <EditorAccordion title="Power Scaling" defaultExpanded>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom>
            Physical Power
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Strength Multiplier"
            value={data.powerScaling.physicalPower.strengthMultiplier}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                physicalPower: { ...data.powerScaling.physicalPower, strengthMultiplier: value },
              })
            }
            step={0.1}
            error={fieldErrors['powerScaling.physicalPower.strengthMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Level Multiplier"
            value={data.powerScaling.physicalPower.levelMultiplier}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                physicalPower: { ...data.powerScaling.physicalPower, levelMultiplier: value },
              })
            }
            step={0.1}
            error={fieldErrors['powerScaling.physicalPower.levelMultiplier']}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Spell Power
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Intellect Multiplier"
            value={data.powerScaling.spellPower.intellectMultiplier}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                spellPower: { ...data.powerScaling.spellPower, intellectMultiplier: value },
              })
            }
            step={0.1}
            error={fieldErrors['powerScaling.spellPower.intellectMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Level Multiplier"
            value={data.powerScaling.spellPower.levelMultiplier}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                spellPower: { ...data.powerScaling.spellPower, levelMultiplier: value },
              })
            }
            step={0.1}
            error={fieldErrors['powerScaling.spellPower.levelMultiplier']}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Tech Power
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Tech Multiplier"
            value={data.powerScaling.techPower.techMultiplier}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                techPower: { ...data.powerScaling.techPower, techMultiplier: value },
              })
            }
            step={0.1}
            error={fieldErrors['powerScaling.techPower.techMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Level Multiplier"
            value={data.powerScaling.techPower.levelMultiplier}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                techPower: { ...data.powerScaling.techPower, levelMultiplier: value },
              })
            }
            step={0.1}
            error={fieldErrors['powerScaling.techPower.levelMultiplier']}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Device Power
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Tech Divisor"
            value={data.powerScaling.devicePower.techDivisor}
            onChange={(value) =>
              updateScaling({
                ...data.powerScaling,
                devicePower: { ...data.powerScaling.devicePower, techDivisor: value },
              })
            }
            error={fieldErrors['powerScaling.devicePower.techDivisor']}
          />
        </Grid>
      </Grid>
    </EditorAccordion>
  );
}
