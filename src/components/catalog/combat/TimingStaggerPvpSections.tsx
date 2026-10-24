import { Grid } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion, OptionalNumberField, OptionalPercentField } from '../../form';

interface TimingStaggerPvpSectionsProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function TimingStaggerPvpSections({
  data,
  onUpdate,
  fieldErrors,
}: TimingStaggerPvpSectionsProps) {
  const patch = (updater: (current: CombatConstantsData) => CombatConstantsData) => {
    onUpdate(updater(data));
  };

  return (
    <>
      <EditorAccordion title="Timing">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Global Cooldown"
              value={data.timing?.globalCooldown}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  timing: { ...current.timing, globalCooldown: value },
                }))
              }
              step={0.1}
              error={fieldErrors['timing.globalCooldown']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Out-of-Combat HP Regen"
              value={data.timing?.outOfCombatHpRegen}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  timing: { ...current.timing, outOfCombatHpRegen: value },
                }))
              }
              error={fieldErrors['timing.outOfCombatHpRegen']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Out-of-Combat Resource Regen"
              value={data.timing?.outOfCombatResourceRegen}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  timing: { ...current.timing, outOfCombatResourceRegen: value },
                }))
              }
              error={fieldErrors['timing.outOfCombatResourceRegen']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Combat Dropoff (seconds)"
              value={data.timing?.combatDropoffSeconds}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  timing: { ...current.timing, combatDropoffSeconds: value },
                }))
              }
              error={fieldErrors['timing.combatDropoffSeconds']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>

      <EditorAccordion title="Stagger">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Base Stagger Threshold"
              value={data.stagger?.baseStaggerThreshold}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  stagger: { ...current.stagger, baseStaggerThreshold: value },
                }))
              }
              error={fieldErrors['stagger.baseStaggerThreshold']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Stagger Recovery Rate"
              value={data.stagger?.staggerRecoveryRate}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  stagger: { ...current.stagger, staggerRecoveryRate: value },
                }))
              }
              error={fieldErrors['stagger.staggerRecoveryRate']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Stagger Duration (seconds)"
              value={data.stagger?.staggerDurationSeconds}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  stagger: { ...current.stagger, staggerDurationSeconds: value },
                }))
              }
              error={fieldErrors['stagger.staggerDurationSeconds']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Stagger Immunity (seconds)"
              value={data.stagger?.staggerImmunitySeconds}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  stagger: { ...current.stagger, staggerImmunitySeconds: value },
                }))
              }
              error={fieldErrors['stagger.staggerImmunitySeconds']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>

      <EditorAccordion title="PvP">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Global Damage Multiplier"
              value={data.pvp?.globalDamageMultiplier}
              onChange={(value) =>
                onUpdate({ ...data, pvp: { ...data.pvp, globalDamageMultiplier: value } })
              }
              error={fieldErrors['pvp.globalDamageMultiplier']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Global Healing Multiplier"
              value={data.pvp?.globalHealingMultiplier}
              onChange={(value) =>
                onUpdate({ ...data, pvp: { ...data.pvp, globalHealingMultiplier: value } })
              }
              error={fieldErrors['pvp.globalHealingMultiplier']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="CC Duration Multiplier"
              value={data.pvp?.ccDurationMultiplier}
              onChange={(value) =>
                onUpdate({ ...data, pvp: { ...data.pvp, ccDurationMultiplier: value } })
              }
              error={fieldErrors['pvp.ccDurationMultiplier']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Execute Threshold Modifier"
              value={data.pvp?.executeThresholdModifier}
              onChange={(value) =>
                onUpdate({ ...data, pvp: { ...data.pvp, executeThresholdModifier: value } })
              }
              error={fieldErrors['pvp.executeThresholdModifier']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>
    </>
  );
}
