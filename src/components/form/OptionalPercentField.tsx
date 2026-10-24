import { useCallback } from 'react';
import { TextField } from '@mui/material';
import { usePercentDraft } from './usePercentDraft';

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
  const handleEmpty = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  const { text, handleChange } = usePercentDraft(value, onChange, handleEmpty);

  return (
    <TextField
      label={`${label} (%)`}
      type="number"
      value={text}
      onChange={handleChange}
      size="small"
      fullWidth
      error={error !== undefined}
      helperText={error ?? helperText}
      slotProps={{ htmlInput: { step: 'any' } }}
    />
  );
}
