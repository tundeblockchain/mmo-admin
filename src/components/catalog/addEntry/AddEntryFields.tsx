import { Box, Chip, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { NumberField, SelectField } from '../../form';
import type { AddEntryField, AddEntryValue, AddEntryValues } from '../../../lib/addEntry';
import type { FieldErrors } from '../../../lib/validation/fieldRules';

interface AddEntryFieldsProps {
  fields: readonly AddEntryField[];
  values: AddEntryValues;
  errors: FieldErrors;
  onChange: (key: string, value: AddEntryValue) => void;
}

export function AddEntryFields({ fields, values, errors, onChange }: AddEntryFieldsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field) => (
        <AddEntryFieldControl
          key={field.key}
          field={field}
          value={values[field.key]}
          error={errors[field.key]}
          onChange={onChange}
        />
      ))}
    </Box>
  );
}

function AddEntryFieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: AddEntryField;
  value: AddEntryValue | undefined;
  error?: string;
  onChange: (key: string, value: AddEntryValue) => void;
}) {
  if (field.kind === 'select') {
    return (
      <SelectField
        label={field.label}
        labelId={`add-entry-${field.key}-label`}
        value={typeof value === 'string' ? value : ''}
        onChange={(next) => onChange(field.key, next)}
        options={field.options}
        error={error !== undefined}
      />
    );
  }

  if (field.kind === 'number') {
    return (
      <NumberField
        label={field.label}
        value={typeof value === 'number' ? value : 0}
        onChange={(next) => onChange(field.key, next)}
        step={field.step}
        error={error}
      />
    );
  }

  if (field.kind === 'boolean') {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={value === true}
            onChange={(_, checked) => onChange(field.key, checked)}
          />
        }
        label={field.label}
      />
    );
  }

  if (field.kind === 'multiselect') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {field.options.map((option) => (
            <Chip
              key={option}
              label={option}
              onClick={() => {
                const next = selected.includes(option)
                  ? selected.filter((item) => item !== option)
                  : [...selected, option];
                onChange(field.key, next);
              }}
              color={selected.includes(option) ? 'primary' : 'default'}
              variant={selected.includes(option) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <TextField
      label={field.label}
      value={typeof value === 'string' ? value : ''}
      onChange={(event) => onChange(field.key, event.target.value)}
      fullWidth
      size="small"
      multiline={field.kind === 'textarea'}
      rows={field.kind === 'textarea' ? 2 : undefined}
      error={error !== undefined}
      helperText={error ?? field.helperText}
    />
  );
}
