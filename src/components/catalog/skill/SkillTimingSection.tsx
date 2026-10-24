import { Grid } from '@mui/material';
import { ACTIVE_PHASE_TYPES } from '../../../lib/catalogSchema';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { ActivePhaseType, SkillDefinition, SkillTiming } from '../../../types/catalog';
import { EditorAccordion, NumberField, SelectField } from '../../form';

interface SkillTimingSectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillTimingSection({ skillData, onUpdate, fieldErrors }: SkillTimingSectionProps) {
  const timing = skillData.timing ?? { castMs: 0, activeMs: 0, recoveryMs: 0 };

  const updateTiming = (next: SkillTiming) => {
    onUpdate({ ...skillData, timing: next });
  };

  return (
    <EditorAccordion title="Timing (ms)">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Cast (ms)"
            value={timing.castMs}
            onChange={(value) => updateTiming({ ...timing, castMs: value })}
            error={fieldErrors['timing.castMs']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Active (ms)"
            value={timing.activeMs}
            onChange={(value) => updateTiming({ ...timing, activeMs: value })}
            error={fieldErrors['timing.activeMs']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Recovery (ms)"
            value={timing.recoveryMs}
            onChange={(value) => updateTiming({ ...timing, recoveryMs: value })}
            error={fieldErrors['timing.recoveryMs']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SelectField
            label="Active Phase Type"
            labelId="active-phase-type-label"
            value={timing.activePhaseType ?? ''}
            onChange={(value) =>
              updateTiming({
                ...timing,
                activePhaseType: value === '' ? undefined : (value as ActivePhaseType),
              })
            }
            options={ACTIVE_PHASE_TYPES}
            includeEmpty
          />
        </Grid>
      </Grid>
    </EditorAccordion>
  );
}
