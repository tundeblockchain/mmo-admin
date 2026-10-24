import { useCallback, useRef, useState } from 'react';
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

function formatPercentDisplay(value: number): string {
  return String(+(value * 100).toFixed(6));
}

function toStoredDecimal(percent: number): number {
  return Number((percent / 100).toFixed(6));
}

function parseFiniteNumber(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function usePercentDraft(
  value: number | undefined,
  onFinite: (stored: number) => void,
  onEmpty?: () => void,
) {
  const lastCommittedRef = useRef(value);
  const [text, setText] = useState(() =>
    value === undefined ? '' : formatPercentDisplay(value),
  );

  if (lastCommittedRef.current !== value) {
    lastCommittedRef.current = value;
    const nextText = value === undefined ? '' : formatPercentDisplay(value);
    if (text !== nextText) {
      setText(nextText);
    }
  }

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextText = event.target.value;
      setText(nextText);

      if (nextText.trim() === '') {
        onEmpty?.();
        return;
      }

      const parsed = parseFiniteNumber(nextText);
      if (parsed === null) {
        return;
      }

      const stored = toStoredDecimal(parsed);
      lastCommittedRef.current = stored;
      onFinite(stored);
    },
    [onEmpty, onFinite],
  );

  return { text, handleChange };
}

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
