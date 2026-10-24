import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { RESOURCE_IDS } from '../../../lib/catalogSchema';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { SkillDefinition } from '../../../types/catalog';
import { EditorAccordion, NumberField, OptionalNumberField, SelectField } from '../../form';

interface SkillBasicSectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillBasicSection({ skillData, onUpdate, fieldErrors }: SkillBasicSectionProps) {
  const resourceOptions =
    skillData.resourceId &&
    !RESOURCE_IDS.includes(skillData.resourceId as (typeof RESOURCE_IDS)[number])
      ? [...RESOURCE_IDS, skillData.resourceId]
      : RESOURCE_IDS;

  return (
    <EditorAccordion title="Basic Properties" defaultExpanded>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <SelectField
            label="Resource"
            labelId="skill-resource-label"
            value={skillData.resourceId ?? ''}
            onChange={(value) => onUpdate({ ...skillData, resourceId: value === '' ? null : value })}
            options={resourceOptions}
            includeEmpty
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Resource Cost"
            value={skillData.resourceCost}
            onChange={(value) => onUpdate({ ...skillData, resourceCost: value })}
            error={fieldErrors.resourceCost}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Cooldown (seconds)"
            value={skillData.cooldownSeconds}
            onChange={(value) => onUpdate({ ...skillData, cooldownSeconds: value })}
            step={0.1}
            error={fieldErrors.cooldownSeconds}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Internal Cooldown (seconds)"
            value={skillData.internalCooldownSeconds}
            onChange={(value) => onUpdate({ ...skillData, internalCooldownSeconds: value })}
            step={0.1}
            error={fieldErrors.internalCooldownSeconds}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Charges"
            value={skillData.charges}
            onChange={(value) => onUpdate({ ...skillData, charges: value })}
            error={fieldErrors.charges}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Charge Recharge (seconds)"
            value={skillData.chargeRechargeSeconds}
            onChange={(value) => onUpdate({ ...skillData, chargeRechargeSeconds: value })}
            step={0.1}
            error={fieldErrors.chargeRechargeSeconds}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Cast Time (seconds)"
            value={skillData.castTimeSeconds}
            onChange={(value) => onUpdate({ ...skillData, castTimeSeconds: value })}
            step={0.1}
            error={fieldErrors.castTimeSeconds}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Range"
            value={skillData.range}
            onChange={(value) => onUpdate({ ...skillData, range: value })}
            error={fieldErrors.range}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Anti-Death Duration (seconds)"
            value={skillData.antiDeathDurationSeconds}
            onChange={(value) => onUpdate({ ...skillData, antiDeathDurationSeconds: value })}
            step={0.1}
            error={fieldErrors.antiDeathDurationSeconds}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Exhausted Duration (seconds)"
            value={skillData.exhaustedDurationSeconds}
            onChange={(value) => onUpdate({ ...skillData, exhaustedDurationSeconds: value })}
            step={0.1}
            error={fieldErrors.exhaustedDurationSeconds}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={skillData.castableWhileMoving}
                onChange={(_, checked) => onUpdate({ ...skillData, castableWhileMoving: checked })}
              />
            }
            label="Castable While Moving"
          />
        </Grid>
      </Grid>
    </EditorAccordion>
  );
}
