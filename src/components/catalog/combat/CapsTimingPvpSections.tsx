import { Grid } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion, OptionalNumberField, OptionalPercentField } from '../../form';

interface CapsTimingPvpSectionsProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function CapsDodgeSections({ data, onUpdate, fieldErrors }: CapsTimingPvpSectionsProps) {
  const patch = (updater: (current: CombatConstantsData) => CombatConstantsData) => {
    onUpdate(updater(data));
  };

  return (
    <>
      <EditorAccordion title="Stat Caps">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Soft Cap"
              value={data.statCaps?.softCap}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  statCaps: { ...current.statCaps, softCap: value },
                }))
              }
              error={fieldErrors['statCaps.softCap']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalNumberField
              label="Hard Cap"
              value={data.statCaps?.hardCap}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  statCaps: { ...current.statCaps, hardCap: value },
                }))
              }
              error={fieldErrors['statCaps.hardCap']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Soft Cap Penalty"
              value={data.statCaps?.softCapPenalty}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  statCaps: { ...current.statCaps, softCapPenalty: value },
                }))
              }
              error={fieldErrors['statCaps.softCapPenalty']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>

      <EditorAccordion title="Dodge">
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Base Dodge Chance"
              value={data.dodge?.baseDodgeChance}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  dodge: { ...current.dodge, baseDodgeChance: value },
                }))
              }
              error={fieldErrors['dodge.baseDodgeChance']}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <OptionalPercentField
              label="Max Dodge Chance"
              value={data.dodge?.maxDodgeChance}
              onChange={(value) =>
                patch((current) => ({
                  ...current,
                  dodge: { ...current.dodge, maxDodgeChance: value },
                }))
              }
              error={fieldErrors['dodge.maxDodgeChance']}
            />
          </Grid>
        </Grid>
      </EditorAccordion>
    </>
  );
}
