import { Grid, TextField } from '@mui/material';
import { SKILL_KINDS } from '../../../lib/catalogSchema';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { SkillDefinition, SkillKind } from '../../../types/catalog';
import { CatalogReferenceSelect, IdentityFields, NumberField, SelectField } from '../../form';

interface SkillIdentitySectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  idError: string | null;
  fieldErrors: FieldErrors;
}

export function SkillIdentitySection({
  skillData,
  onUpdate,
  idError,
  fieldErrors,
}: SkillIdentitySectionProps) {
  return (
    <IdentityFields
      idLabel="Skill ID"
      idValue={skillData.skillId}
      onIdChange={(value) => onUpdate({ ...skillData, skillId: value })}
      idError={idError}
      idHelperText="Unique identifier for this skill (e.g. vanguard_cleaving_strike)."
      nameValue={skillData.displayName}
      onNameChange={(value) => onUpdate({ ...skillData, displayName: value })}
      descriptionValue={skillData.description}
      onDescriptionChange={(value) => onUpdate({ ...skillData, description: value })}
    >
      <TextField
        label="Icon Path"
        value={skillData.iconPath}
        onChange={(event) => onUpdate({ ...skillData, iconPath: event.target.value })}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        helperText="Asset path stored on the skill (e.g. icons/skills/vanguard/cleaving_strike.png)."
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SelectField
            label="Kind"
            labelId="skill-kind-label"
            value={skillData.kind}
            onChange={(value) => onUpdate({ ...skillData, kind: value as SkillKind })}
            options={SKILL_KINDS}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CatalogReferenceSelect
            catalogType="class"
            label="Class"
            labelId="skill-class-label"
            value={skillData.classId}
            onChange={(value) => onUpdate({ ...skillData, classId: value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NumberField
            label="Unlock Level"
            value={skillData.unlockLevel}
            onChange={(value) => onUpdate({ ...skillData, unlockLevel: value })}
            error={fieldErrors.unlockLevel}
          />
        </Grid>
      </Grid>
    </IdentityFields>
  );
}
