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
