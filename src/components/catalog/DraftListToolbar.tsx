import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface DraftListToolbarProps {
  label: string;
  onAdd: () => void;
}

export function DraftListToolbar({ label, onAdd }: DraftListToolbarProps) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={onAdd}>
        Add {label}
      </Button>
    </Box>
  );
}
