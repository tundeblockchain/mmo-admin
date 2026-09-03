import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import type { CatalogType, CatalogVersionSummary } from '../../types/catalog';

const CATALOG_TYPE_LABELS: Record<CatalogType, string> = {
  class: 'Classes',
  skill: 'Skills',
  'combat-constants': 'Combat Constants',
  status: 'Statuses',
  element: 'Elements',
  resonance: 'Resonance',
};

interface VersionPickerProps {
  catalogType: CatalogType;
  versions: CatalogVersionSummary[];
  selectedVersion: number | null;
  onVersionChange: (version: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  disabled?: boolean;
}

export function VersionPicker({
  catalogType,
  versions,
  selectedVersion,
  onVersionChange,
  isLoading = false,
  error = null,
  disabled = false,
}: VersionPickerProps) {
  const typeVersions = versions.filter((v) => v.catalogType === catalogType);
  const sortedVersions = [...typeVersions].sort((a, b) => b.version - a.version);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    if (typeof value === 'number') {
      onVersionChange(value);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <span>Loading versions...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 400 }}>
        Failed to load versions: {error.message}
      </Alert>
    );
  }

  if (sortedVersions.length === 0) {
    return (
      <Alert severity="info" sx={{ maxWidth: 400 }}>
        No published versions available for {CATALOG_TYPE_LABELS[catalogType]}.
      </Alert>
    );
  }

  return (
    <FormControl sx={{ minWidth: 200 }} size="small" disabled={disabled}>
      <InputLabel id={`version-picker-${catalogType}-label`}>
        {CATALOG_TYPE_LABELS[catalogType]} Version
      </InputLabel>
      <Select
        labelId={`version-picker-${catalogType}-label`}
        id={`version-picker-${catalogType}`}
        value={selectedVersion ?? ''}
        label={`${CATALOG_TYPE_LABELS[catalogType]} Version`}
        onChange={handleChange}
        disabled={disabled}
      >
        {sortedVersions.map((v) => (
          <MenuItem key={v.version} value={v.version}>
            v{v.version} - {new Date(v.publishedAt).toLocaleDateString()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
