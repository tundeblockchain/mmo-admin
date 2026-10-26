import {
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useCatalogOptions } from '../../hooks/useCatalogOptions';
import {
  catalogReferenceEmptyMessage,
  catalogReferenceHref,
  catalogReferenceLinkLabel,
  optionsWithCurrentValue,
  type CatalogReferenceType,
} from '../../lib/catalogOptions';

interface CatalogReferenceSelectProps {
  catalogType: CatalogReferenceType;
  label: string;
  labelId: string;
  value: string;
  onChange: (value: string) => void;
  includeEmpty?: boolean;
  emptyLabel?: string;
  error?: boolean;
  helperText?: string;
}

export function CatalogReferenceSelect({
  catalogType,
  label,
  labelId,
  value,
  onChange,
  includeEmpty = false,
  emptyLabel,
  error = false,
  helperText,
}: CatalogReferenceSelectProps) {
  const { options, isLoading, isEmpty } = useCatalogOptions(catalogType);
  const selectOptions = isEmpty ? [] : optionsWithCurrentValue(options, value);
  const selectValue = isEmpty ? '' : value;
  const showEmptyOption = includeEmpty || selectValue === '' || isEmpty;
  const resolvedEmptyLabel = emptyLabel ?? (includeEmpty ? 'None' : 'Select…');
  const emptyMessage = catalogReferenceEmptyMessage(catalogType);
  const helperId = `${labelId}-helper`;

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      fullWidth
      size="small"
      error={error && !isEmpty}
      disabled={isLoading || isEmpty}
    >
      <InputLabel id={labelId} shrink>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        value={selectValue}
        label={label}
        onChange={handleChange}
        displayEmpty
        notched
        aria-describedby={isEmpty || helperText ? helperId : undefined}
      >
        {showEmptyOption && (
          <MenuItem value="" disabled={!includeEmpty}>
            {isLoading ? 'Loading…' : resolvedEmptyLabel}
          </MenuItem>
        )}
        {selectOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {isEmpty ? (
        <FormHelperText id={helperId}>
          {emptyMessage}{' '}
          <Link component={RouterLink} to={catalogReferenceHref(catalogType)}>
            {catalogReferenceLinkLabel(catalogType)}
          </Link>
        </FormHelperText>
      ) : helperText ? (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
