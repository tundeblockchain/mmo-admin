import { Box, Button } from '@mui/material';
import { useAddEntryForm } from '../../../hooks/useAddEntryForm';
import { getAddEntryConfig, type AddEntryEntity } from '../../../lib/addEntry';
import type { CatalogType } from '../../../types/catalog';
import { AddEntryFields } from './AddEntryFields';

interface AddEntryFormProps {
  catalogType: CatalogType;
  existingIds: string[];
  onSubmit: (entry: AddEntryEntity) => void;
  onCancel: () => void;
}

export function AddEntryForm({
  catalogType,
  existingIds,
  onSubmit,
  onCancel,
}: AddEntryFormProps) {
  const config = getAddEntryConfig(catalogType);
  const { values, setField, errors, canSubmit, submit } = useAddEntryForm(
    catalogType,
    existingIds,
  );

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        const entry = submit();
        if (entry) {
          onSubmit(entry);
        }
      }}
    >
      <AddEntryFields
        fields={config.fields}
        values={values}
        errors={errors}
        onChange={setField}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <Button onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={!canSubmit}>
          Add entry
        </Button>
      </Box>
    </Box>
  );
}
