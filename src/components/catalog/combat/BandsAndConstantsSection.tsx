import { Button, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion, NumberField } from '../../form';

interface BandsAndConstantsSectionProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function StatAllocationBandsSection({
  data,
  onUpdate,
  fieldErrors,
}: BandsAndConstantsSectionProps) {
  return (
    <EditorAccordion title="Stat Allocation Bands">
      {(data.statAllocationBands ?? []).map((band, index) => (
        <Grid container spacing={2} key={`band-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
          <Grid size={{ xs: 6, md: 2 }}>
            <NumberField
              label="Min Level"
              value={band.minLevel}
              onChange={(value) => {
                const statAllocationBands = [...(data.statAllocationBands ?? [])];
                statAllocationBands[index] = { ...statAllocationBands[index], minLevel: value };
                onUpdate({ ...data, statAllocationBands });
              }}
              error={fieldErrors[`statAllocationBands.${index}.minLevel`]}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <NumberField
              label="Max Level"
              value={band.maxLevel}
              onChange={(value) => {
                const statAllocationBands = [...(data.statAllocationBands ?? [])];
                statAllocationBands[index] = { ...statAllocationBands[index], maxLevel: value };
                onUpdate({ ...data, statAllocationBands });
              }}
              error={fieldErrors[`statAllocationBands.${index}.maxLevel`]}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <NumberField
              label="Points Per Level"
              value={band.pointsPerLevel}
              onChange={(value) => {
                const statAllocationBands = [...(data.statAllocationBands ?? [])];
                statAllocationBands[index] = {
                  ...statAllocationBands[index],
                  pointsPerLevel: value,
                };
                onUpdate({ ...data, statAllocationBands });
              }}
              error={fieldErrors[`statAllocationBands.${index}.pointsPerLevel`]}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <NumberField
              label="Allocation Cost Per Point"
              value={band.allocationCostPerPoint}
              onChange={(value) => {
                const statAllocationBands = [...(data.statAllocationBands ?? [])];
                statAllocationBands[index] = {
                  ...statAllocationBands[index],
                  allocationCostPerPoint: value,
                };
                onUpdate({ ...data, statAllocationBands });
              }}
              error={fieldErrors[`statAllocationBands.${index}.allocationCostPerPoint`]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 1 }}>
            <IconButton
              aria-label={`Remove allocation band ${index + 1}`}
              onClick={() => {
                const statAllocationBands = (data.statAllocationBands ?? []).filter(
                  (_, itemIndex) => itemIndex !== index,
                );
                onUpdate({
                  ...data,
                  statAllocationBands:
                    statAllocationBands.length === 0 ? undefined : statAllocationBands,
                });
              }}
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
            ...data,
            statAllocationBands: [
              ...(data.statAllocationBands ?? []),
              { minLevel: 1, maxLevel: 10, pointsPerLevel: 1, allocationCostPerPoint: 1 },
            ],
          })
        }
        size="small"
      >
        Add allocation band
      </Button>
    </EditorAccordion>
  );
}
