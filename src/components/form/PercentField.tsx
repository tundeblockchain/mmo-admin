import { TextField } from '@mui/material';
import { usePercentDraft } from './usePercentDraft';

interface PercentFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  error?: string;
}

export function PercentField({ label, value, onChange, helperText, error }: PercentFieldProps) {
  const { text, handleChange } = usePercentDraft(value, onChange);
  const fieldLabel = label === '' ? undefined : `${label} (%)`;

  return (
    <TextField
      label={fieldLabel}
      type="number"
      value={text}
      onChange={handleChange}
      size="small"
      fullWidth
      error={error !== undefined}
      helperText={error ?? helperText}
      slotProps={{
        htmlInput: {
          step: 'any',
          ...(label === '' ? { 'aria-label': 'Multiplier (%)' } : {}),
        },
        inputLabel: { shrink: fieldLabel !== undefined },
      }}
    />
  );
}
