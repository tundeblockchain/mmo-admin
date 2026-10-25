import { useCallback } from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useCatalogOptions } from '../../hooks/useCatalogOptions';
import type { FieldErrors } from '../../lib/catalogValidation';
import type { ElementDefinition } from '../../types/catalog';
import { CatalogEditorLayout, IdentityFields, PercentField } from '../form';

interface ElementEditorProps {
  elementData: ElementDefinition;
  onUpdate: (updated: ElementDefinition) => void;
  idError?: string | null;
  fieldErrors?: FieldErrors;
}

export function ElementEditor({
  elementData,
  onUpdate,
  idError = null,
  fieldErrors = {},
}: ElementEditorProps) {
  const handleFieldChange = useCallback(
    (field: keyof ElementDefinition, value: string) => {
      onUpdate({ ...elementData, [field]: value });
    },
    [elementData, onUpdate],
  );

  const handleMultiplierChange = useCallback(
    (map: 'strongAgainst' | 'weakAgainst', element: string, value: number) => {
      const next = { ...elementData[map] };
      if (value === 0) {
        delete next[element];
      } else {
        next[element] = value;
      }
      onUpdate({ ...elementData, [map]: next });
    },
    [elementData, onUpdate],
  );

  const { options: elementOptions } = useCatalogOptions('element');
  const otherElements = Array.from(
    new Set([
      ...elementOptions
        .map((option) => option.id)
        .filter((elementId) => elementId !== elementData.elementId),
      ...Object.keys(elementData.strongAgainst),
      ...Object.keys(elementData.weakAgainst),
    ]),
  );

  return (
    <CatalogEditorLayout
      title="Element Editor"
      description="Edit element properties and damage multipliers. Multipliers are displayed as percentages but stored as decimals (e.g., 150% = 1.50)."
      headerAdornment={
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: elementData.color,
            border: '2px solid',
            borderColor: 'divider',
          }}
        />
      }
    >
      <IdentityFields
        idLabel="Element ID"
        idValue={elementData.elementId}
        onIdChange={(value) => handleFieldChange('elementId', value)}
        idError={idError}
        idHelperText="Unique identifier for this element (e.g. fire)."
        nameValue={elementData.displayName}
        onNameChange={(value) => handleFieldChange('displayName', value)}
      >
        <TextField
          label="Color (hex)"
          value={elementData.color}
          onChange={(event) => handleFieldChange('color', event.target.value)}
          fullWidth
          size="small"
          placeholder="#ff6600"
          error={fieldErrors.color !== undefined}
          helperText={fieldErrors.color}
        />
      </IdentityFields>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom color="success.main">
            Strong Against (bonus damage)
          </Typography>
          <MultiplierTable
            elements={otherElements}
            values={elementData.strongAgainst}
            fieldPrefix="strongAgainst"
            fieldErrors={fieldErrors}
            onChange={(element, value) => handleMultiplierChange('strongAgainst', element, value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom color="error.main">
            Weak Against (reduced damage)
          </Typography>
          <MultiplierTable
            elements={otherElements}
            values={elementData.weakAgainst}
            fieldPrefix="weakAgainst"
            fieldErrors={fieldErrors}
            onChange={(element, value) => handleMultiplierChange('weakAgainst', element, value)}
          />
        </Grid>
      </Grid>
    </CatalogEditorLayout>
  );
}

interface MultiplierTableProps {
  elements: string[];
  values: Record<string, number>;
  fieldPrefix: string;
  fieldErrors: FieldErrors;
  onChange: (element: string, value: number) => void;
}

function MultiplierTable({
  elements,
  values,
  fieldPrefix,
  fieldErrors,
  onChange,
}: MultiplierTableProps) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Element</TableCell>
          <TableCell align="right">Multiplier (%)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {elements.map((element) => (
          <TableRow key={element}>
            <TableCell sx={{ textTransform: 'capitalize' }}>{element}</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              <PercentField
                label=""
                value={values[element] ?? 0}
                onChange={(value) => onChange(element, value)}
                error={fieldErrors[`${fieldPrefix}.${element}`]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
