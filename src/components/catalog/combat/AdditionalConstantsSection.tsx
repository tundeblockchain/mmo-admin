import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion } from '../../form';

interface AdditionalConstantsSectionProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

type AdditionalConstantType = 'number' | 'boolean' | 'string';

function additionalConstantType(value: number | boolean | string): AdditionalConstantType {
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  return 'string';
}

function parseAdditionalConstant(
  raw: string,
  valueType: AdditionalConstantType,
): number | boolean | string {
  if (valueType === 'boolean') {
    return raw === 'true';
  }
  if (valueType === 'number') {
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return raw;
}

export function AdditionalConstantsSection({
  data,
  onUpdate,
  fieldErrors,
}: AdditionalConstantsSectionProps) {
  const additionalConstants = Object.entries(data.additionalConstants ?? {});

  return (
    <EditorAccordion title="Additional Constants">
      {additionalConstants.map(([key, value], index) => {
        const valueType = additionalConstantType(value);
        return (
          <Grid container spacing={2} key={`constant-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Key"
                value={key}
                onChange={(event) => {
                  const next = { ...data.additionalConstants };
                  delete next[key];
                  next[event.target.value] = value;
                  onUpdate({ ...data, additionalConstants: next });
                }}
                size="small"
                fullWidth
                error={key.trim() === '' && fieldErrors['additionalConstants.key'] !== undefined}
                helperText={key.trim() === '' ? fieldErrors['additionalConstants.key'] : undefined}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id={`constant-type-${index}-label`}>Type</InputLabel>
                <Select
                  labelId={`constant-type-${index}-label`}
                  value={valueType}
                  label="Type"
                  onChange={(event: SelectChangeEvent<AdditionalConstantType>) => {
                    const nextType = event.target.value as AdditionalConstantType;
                    let next: number | boolean | string = 0;
                    if (nextType === 'boolean') {
                      next = Boolean(value);
                    } else if (nextType === 'string') {
                      next = String(value);
                    } else if (typeof value === 'number') {
                      next = value;
                    }
                    onUpdate({
                      ...data,
                      additionalConstants: { ...data.additionalConstants, [key]: next },
                    });
                  }}
                >
                  <MenuItem value="number">number</MenuItem>
                  <MenuItem value="boolean">boolean</MenuItem>
                  <MenuItem value="string">string</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 5, md: 4 }}>
              {valueType === 'boolean' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(value)}
                      onChange={(_, checked) =>
                        onUpdate({
                          ...data,
                          additionalConstants: { ...data.additionalConstants, [key]: checked },
                        })
                      }
                    />
                  }
                  label="Value"
                />
              ) : (
                <TextField
                  label="Value"
                  type={valueType === 'number' ? 'number' : 'text'}
                  value={String(value)}
                  onChange={(event) =>
                    onUpdate({
                      ...data,
                      additionalConstants: {
                        ...data.additionalConstants,
                        [key]: parseAdditionalConstant(event.target.value, valueType),
                      },
                    })
                  }
                  size="small"
                  fullWidth
                  error={fieldErrors[`additionalConstants.${key}`] !== undefined}
                  helperText={fieldErrors[`additionalConstants.${key}`]}
                />
              )}
            </Grid>
            <Grid size={{ xs: 1 }}>
              <IconButton
                aria-label={`Remove additional constant ${key || index + 1}`}
                onClick={() => {
                  const next = { ...data.additionalConstants };
                  delete next[key];
                  onUpdate({
                    ...data,
                    additionalConstants: Object.keys(next).length === 0 ? undefined : next,
                  });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        );
      })}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          onUpdate({
            ...data,
            additionalConstants: { ...data.additionalConstants, '': 0 },
          })
        }
        size="small"
      >
        Add additional constant
      </Button>
    </EditorAccordion>
  );
}
