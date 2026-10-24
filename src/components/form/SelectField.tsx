import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

interface SelectFieldProps<T extends string> {
  label: string;
  labelId: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  includeEmpty?: boolean;
  emptyLabel?: string;
  error?: boolean;
}

export function SelectField<T extends string>({
  label,
  labelId,
  value,
  onChange,
  options,
  includeEmpty = false,
  emptyLabel = 'None',
  error = false,
}: SelectFieldProps<T>) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as T);
  };

  return (
    <FormControl fullWidth size="small" error={error}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} value={value} label={label} onChange={handleChange}>
        {includeEmpty && <MenuItem value="">{emptyLabel}</MenuItem>}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
