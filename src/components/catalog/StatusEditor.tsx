import { useCallback } from 'react';
import { FormControlLabel, Checkbox, Grid, TextField, Typography } from '@mui/material';
import { STATUS_CATEGORIES } from '../../lib/catalogSchema';
import type { FieldErrors } from '../../lib/catalogValidation';
import type { StatusCategory, StatusDefinition } from '../../types/catalog';
import { CatalogEditorLayout, IdentityFields, SelectField } from '../form';

interface StatusEditorProps {
  statusData: StatusDefinition;
  onUpdate: (updated: StatusDefinition) => void;
  idError?: string | null;
  fieldErrors?: FieldErrors;
}

export function StatusEditor({
  statusData,
  onUpdate,
  idError = null,
  fieldErrors = {},
}: StatusEditorProps) {
  const handleFieldChange = useCallback(
    (field: keyof StatusDefinition, value: StatusDefinition[keyof StatusDefinition]) => {
      onUpdate({ ...statusData, [field]: value });
    },
    [statusData, onUpdate],
  );

  return (
    <CatalogEditorLayout title="Status Editor" description="Edit status effect properties.">
      <IdentityFields
        idLabel="Status ID"
        idValue={statusData.statusId}
        onIdChange={(value) => handleFieldChange('statusId', value)}
        idError={idError}
        idHelperText="Unique identifier for this status (e.g. flame)."
        nameValue={statusData.displayName}
        onNameChange={(value) => handleFieldChange('displayName', value)}
        descriptionValue={statusData.description}
        onDescriptionChange={(value) => handleFieldChange('description', value)}
      />

      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            label="Category"
            labelId="status-category-label"
            value={statusData.category}
            onChange={(value) => handleFieldChange('category', value as StatusCategory)}
            options={STATUS_CATEGORIES}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Max Stacks"
            type="number"
            value={statusData.maxStacks}
            onChange={(event) =>
              handleFieldChange('maxStacks', parseInt(event.target.value, 10) || 0)
            }
            fullWidth
            size="small"
            error={fieldErrors.maxStacks !== undefined}
            helperText={fieldErrors.maxStacks}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Icon Path"
            value={statusData.iconPath}
            onChange={(event) => handleFieldChange('iconPath', event.target.value)}
            fullWidth
            size="small"
            helperText="Asset path stored on the status (e.g. icons/statuses/flame.png)."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={statusData.dispellable}
                onChange={(_, checked) => handleFieldChange('dispellable', checked)}
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
                onChange={(_, checked) => handleFieldChange('persistsThroughDeath', checked)}
              />
            }
            label="Persists Through Death"
          />
        </Grid>
      </Grid>
    </CatalogEditorLayout>
  );
}
