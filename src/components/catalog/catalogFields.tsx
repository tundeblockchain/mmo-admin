import { useCallback } from 'react';
import { TextField } from '@mui/material';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  error?: string;
}

export function NumberField({ label, value, onChange, step = 1, error }: NumberFieldProps) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(event.target.value) || 0);
    },
    [onChange],
  );

  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={handleChange}
      size="small"
      fullWidth
      error={error !== undefined}
      helperText={error}
      slotProps={{ htmlInput: { step } }}
    />
  );
}

interface OptionalNumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  step?: number;
  error?: string;
}

export function OptionalNumberField({
  label,
  value,
  onChange,
  step = 1,
  error,
}: OptionalNumberFieldProps) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === '') {
        onChange(undefined);
        return;
      }
      const parsed = parseFloat(event.target.value);
      onChange(Number.isFinite(parsed) ? parsed : undefined);
    },
    [onChange],
  );

  return (
    <TextField
      label={label}
      type="number"
      value={value ?? ''}
      onChange={handleChange}
      size="small"
      fullWidth
      error={error !== undefined}
      helperText={error}
      slotProps={{ htmlInput: { step } }}
    />
  );
}

interface PercentFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  error?: string;
}

export function PercentField({ label, value, onChange, helperText, error }: PercentFieldProps) {
  const displayValue = (value * 100).toFixed(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const percentValue = parseFloat(event.target.value) || 0;
      onChange(percentValue / 100);
    },
    [onChange],
  );

  const fieldLabel = label === '' ? undefined : `${label} (%)`;

  return (
    <TextField
      label={fieldLabel}
      type="number"
      value={displayValue}
      onChange={handleChange}
      size="small"
      fullWidth
      error={error !== undefined}
      helperText={error ?? helperText}
      slotProps={{
        htmlInput: {
          step: 1,
          ...(label === '' ? { 'aria-label': 'Multiplier (%)' } : {}),
        },
        inputLabel: { shrink: fieldLabel !== undefined },
      }}
    />
  );
}

interface OptionalPercentFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  helperText?: string;
  error?: string;
}

export function OptionalPercentField({
  label,
  value,
  onChange,
  helperText,
  error,
}: OptionalPercentFieldProps) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === '') {
        onChange(undefined);
        return;
      }
      const percentValue = parseFloat(event.target.value);
      onChange(Number.isFinite(percentValue) ? percentValue / 100 : undefined);
    },
    [onChange],
  );

  return (
    <TextField
      label={`${label} (%)`}
      type="number"
      value={value === undefined ? '' : (value * 100).toFixed(0)}
      onChange={handleChange}
      size="small"
      fullWidth
      error={error !== undefined}
      helperText={error ?? helperText}
      slotProps={{ htmlInput: { step: 1 } }}
    />
  );
}
