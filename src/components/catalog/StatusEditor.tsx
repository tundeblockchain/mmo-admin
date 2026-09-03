import { useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  type SelectChangeEvent,
} from '@mui/material';
import type { StatusDefinition, StatusCategory } from '../../types/catalog';

interface StatusEditorProps {
  statusData: StatusDefinition;
  onUpdate: (updated: StatusDefinition) => void;
}

const CATEGORIES: StatusCategory[] = ['buff', 'debuff', 'dot', 'hot', 'control'];

export function StatusEditor({ statusData, onUpdate }: StatusEditorProps) {
  const handleTextChange = useCallback(
    (field: keyof StatusDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...statusData, [field]: event.target.value });
    },
    [statusData, onUpdate],
  );

  const handleNumberChange = useCallback(
    (field: keyof StatusDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10) || 0;
      onUpdate({ ...statusData, [field]: value });
    },
    [statusData, onUpdate],
  );

  const handleBooleanChange = useCallback(
    (field: keyof StatusDefinition) =>
      (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        onUpdate({ ...statusData, [field]: checked });
      },
    [statusData, onUpdate],
  );

  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent<StatusCategory>) => {
      onUpdate({ ...statusData, category: event.target.value as StatusCategory });
    },
    [statusData, onUpdate],
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Status Editor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Edit status effect properties.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Display Name"
          value={statusData.displayName}
          onChange={handleTextChange('displayName')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={statusData.description}
          onChange={handleTextChange('description')}
          fullWidth
          multiline
          rows={2}
          size="small"
          sx={{ mb: 2 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-category-label">Category</InputLabel>
            <Select
              labelId="status-category-label"
              value={statusData.category}
              label="Category"
              onChange={handleCategoryChange}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Max Stacks"
            type="number"
            value={statusData.maxStacks}
            onChange={handleNumberChange('maxStacks')}
            fullWidth
            size="small"
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={statusData.dispellable}
                onChange={handleBooleanChange('dispellable')}
              />
            }
            label="Dispellable"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={statusData.persistsThroughDeath}
                onChange={handleBooleanChange('persistsThroughDeath')}
              />
            }
            label="Persists Through Death"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
