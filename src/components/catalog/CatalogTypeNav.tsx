import { Tabs, Tab, Box } from '@mui/material';
import type { CatalogType } from '../../types/catalog';

const CATALOG_TYPES: CatalogType[] = [
  'class',
  'skill',
  'combat-constants',
  'status',
  'element',
  'resonance',
];

const CATALOG_TYPE_LABELS: Record<CatalogType, string> = {
  class: 'Classes',
  skill: 'Skills',
  'combat-constants': 'Combat Constants',
  status: 'Statuses',
  element: 'Elements',
  resonance: 'Resonance',
};

interface CatalogTypeNavProps {
  selectedType: CatalogType;
  onTypeChange: (type: CatalogType) => void;
}

export function CatalogTypeNav({ selectedType, onTypeChange }: CatalogTypeNavProps) {
  const handleChange = (_event: React.SyntheticEvent, newValue: CatalogType) => {
    onTypeChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={selectedType}
        onChange={handleChange}
        aria-label="Catalog type navigation"
        variant="scrollable"
        scrollButtons="auto"
      >
        {CATALOG_TYPES.map((type) => (
          <Tab key={type} label={CATALOG_TYPE_LABELS[type]} value={type} />
        ))}
      </Tabs>
    </Box>
  );
}
