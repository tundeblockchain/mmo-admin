import { useCallback } from 'react';
import { TextField } from '@mui/material';

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
