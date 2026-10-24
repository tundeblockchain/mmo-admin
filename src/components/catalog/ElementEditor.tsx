import { useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import { ELEMENT_IDS } from '../../lib/catalogSchema';
import type { FieldErrors } from '../../lib/catalogValidation';
import { PercentField } from './catalogFields';
import type { ElementDefinition } from '../../types/catalog';

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
  const handleTextChange = useCallback(
    (field: keyof ElementDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...elementData, [field]: event.target.value });
    },
    [elementData, onUpdate],
  );

  const handleStrongAgainstChange = useCallback(
    (element: string, value: number) => {
      const strongAgainst = { ...elementData.strongAgainst };
      if (value === 0) {
        delete strongAgainst[element];
      } else {
        strongAgainst[element] = value;
      }
      onUpdate({ ...elementData, strongAgainst });
    },
    [elementData, onUpdate],
  );

  const handleWeakAgainstChange = useCallback(
    (element: string, value: number) => {
      const weakAgainst = { ...elementData.weakAgainst };
      if (value === 0) {
        delete weakAgainst[element];
      } else {
        weakAgainst[element] = value;
      }
      onUpdate({ ...elementData, weakAgainst });
    },
    [elementData, onUpdate],
  );

  const otherElements = Array.from(
    new Set([
      ...ELEMENT_IDS.filter((element) => element !== elementData.elementId),
      ...Object.keys(elementData.strongAgainst),
      ...Object.keys(elementData.weakAgainst),
    ]),
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
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
        <Typography variant="h5">Element Editor</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Edit element properties and damage multipliers. Multipliers are displayed as percentages but
        stored as decimals (e.g., 150% = 1.50).
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Element ID"
          value={elementData.elementId}
          onChange={handleTextChange('elementId')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          error={idError !== null}
          helperText={idError ?? 'Unique identifier for this element (e.g. fire).'}
        />
        <TextField
          label="Display Name"
          value={elementData.displayName}
          onChange={handleTextChange('displayName')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Color (hex)"
          value={elementData.color}
          onChange={handleTextChange('color')}
          fullWidth
          size="small"
          placeholder="#ff6600"
          error={fieldErrors.color !== undefined}
          helperText={fieldErrors.color}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom color="success.main">
            Strong Against (bonus damage)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Element</TableCell>
                <TableCell align="right">Multiplier (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {otherElements.map((element) => (
                <TableRow key={element}>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{element}</TableCell>
                  <TableCell align="right" sx={{ width: 120 }}>
                    <PercentField
                      label=""
                      value={elementData.strongAgainst[element] ?? 0}
                      onChange={(value) => handleStrongAgainstChange(element, value)}
                      error={fieldErrors[`strongAgainst.${element}`]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom color="error.main">
            Weak Against (reduced damage)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Element</TableCell>
                <TableCell align="right">Multiplier (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {otherElements.map((element) => (
                <TableRow key={element}>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{element}</TableCell>
                  <TableCell align="right" sx={{ width: 120 }}>
                    <PercentField
                      label=""
                      value={elementData.weakAgainst[element] ?? 0}
                      onChange={(value) => handleWeakAgainstChange(element, value)}
                      error={fieldErrors[`weakAgainst.${element}`]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
}
