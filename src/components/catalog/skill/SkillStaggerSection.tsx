import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { SkillDefinition, StaggerCoefficients } from '../../../types/catalog';
import { EditorAccordion, NumberField, OptionalNumberField, OptionalPercentField } from '../../form';

interface SkillStaggerSectionProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  fieldErrors: FieldErrors;
}

export function SkillStaggerSection({ skillData, onUpdate, fieldErrors }: SkillStaggerSectionProps) {
  const stagger = skillData.stagger ?? { staggerPower: 0, canStagger: false };

  const updateStagger = (next: StaggerCoefficients) => {
    onUpdate({ ...skillData, stagger: next });
  };

  return (
    <EditorAccordion title="Stagger">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Stagger Power"
            value={stagger.staggerPower}
            onChange={(value) => updateStagger({ ...stagger, staggerPower: value })}
            error={fieldErrors['stagger.staggerPower']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalPercentField
            label="Stagger Resist"
            value={stagger.staggerResist}
            onChange={(value) => updateStagger({ ...stagger, staggerResist: value })}
            error={fieldErrors['stagger.staggerResist']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Per-Stack Stagger"
            value={stagger.perStackStagger}
            onChange={(value) => updateStagger({ ...stagger, perStackStagger: value })}
            error={fieldErrors['stagger.perStackStagger']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <OptionalNumberField
            label="Stagger Per Hit"
            value={stagger.staggerPerHit}
            onChange={(value) => updateStagger({ ...stagger, staggerPerHit: value })}
            error={fieldErrors['stagger.staggerPerHit']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={stagger.canStagger}
                onChange={(_, checked) => updateStagger({ ...stagger, canStagger: checked })}
              />
            }
            label="Can Stagger"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Bonus Stagger Condition"
            value={stagger.bonusStagger?.condition ?? ''}
            onChange={(event) =>
              updateStagger({
                ...stagger,
                bonusStagger: {
                  condition: event.target.value,
                  value: stagger.bonusStagger?.value ?? 0,
                },
              })
            }
            size="small"
            fullWidth
            error={fieldErrors['stagger.bonusStagger.condition'] !== undefined}
            helperText={fieldErrors['stagger.bonusStagger.condition']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Bonus Stagger Value"
            value={stagger.bonusStagger?.value ?? 0}
            onChange={(value) =>
              updateStagger({
                ...stagger,
                bonusStagger: {
                  condition: stagger.bonusStagger?.condition ?? '',
                  value,
                },
              })
            }
            error={fieldErrors['stagger.bonusStagger.value']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Status Buildup"
            value={stagger.statusBuildup?.status ?? ''}
            onChange={(event) =>
              updateStagger({
                ...stagger,
                statusBuildup: {
                  status: event.target.value,
                  value: stagger.statusBuildup?.value ?? 0,
                },
              })
            }
            size="small"
            fullWidth
            error={fieldErrors['stagger.statusBuildup.status'] !== undefined}
            helperText={fieldErrors['stagger.statusBuildup.status']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Status Buildup Value"
            value={stagger.statusBuildup?.value ?? 0}
            onChange={(value) =>
              updateStagger({
                ...stagger,
                statusBuildup: {
                  status: stagger.statusBuildup?.status ?? '',
                  value,
                },
              })
            }
            error={fieldErrors['stagger.statusBuildup.value']}
          />
        </Grid>
      </Grid>
    </EditorAccordion>
  );
}
