import { Grid } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion, OptionalNumberField } from '../../form';

interface OptionalCombatSectionsProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function SpeedVitalitySections({ data, onUpdate, fieldErrors }: OptionalCombatSectionsProps) {
  const patch = (updater: (current: CombatConstantsData) => CombatConstantsData) => {
    onUpdate(updater(data));
  };

  return (
    <>
      <EditorAccordion title="Speed">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Attack Speed Finesse Constant"
              value={data.speed?.attackSpeed?.finesseConstant}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  speed: {
                    ...current.speed,
                    attackSpeed: { ...current.speed?.attackSpeed, finesseConstant: value },
                  },
                }))
              }
              error={fieldErrors['speed.attackSpeed.finesseConstant']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Attack Speed Cap"
              value={data.speed?.attackSpeed?.attackSpeedCap}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  speed: {
                    ...current.speed,
                    attackSpeed: { ...current.speed?.attackSpeed, attackSpeedCap: value },
                  },
                }))
              }
              step={0.1}
              error={fieldErrors['speed.attackSpeed.attackSpeedCap']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Dodge Recovery Finesse Constant"
              value={data.speed?.dodgeRecovery?.finesseConstant}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  speed: {
                    ...current.speed,
                    dodgeRecovery: { ...current.speed?.dodgeRecovery, finesseConstant: value },
                  },
                }))
              }
              error={fieldErrors['speed.dodgeRecovery.finesseConstant']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>

      <EditorAccordion title="Vitality">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Max HP Vitality Divisor"
              value={data.vitality?.maxHp?.vitalityDivisor}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  vitality: {
                    ...current.vitality,
                    maxHp: { ...current.vitality?.maxHp, vitalityDivisor: value },
                  },
                }))
              }
              error={fieldErrors['vitality.maxHp.vitalityDivisor']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Healing Received Vitality Divisor"
              value={data.vitality?.healingReceived?.vitalityDivisor}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  vitality: {
                    ...current.vitality,
                    healingReceived: {
                      ...current.vitality?.healingReceived,
                      vitalityDivisor: value,
                    },
                  },
                }))
              }
              error={fieldErrors['vitality.healingReceived.vitalityDivisor']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>
    </>
  );
}
