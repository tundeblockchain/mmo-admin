import { useCallback } from 'react';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../lib/catalogValidation';
import type { ResonanceDefinition, ResonancePartyBonus } from '../../types/catalog';
import { CatalogEditorLayout, IdentityFields, PercentField } from '../form';

interface ResonanceEditorProps {
  resonanceData: ResonanceDefinition;
  onUpdate: (updated: ResonanceDefinition) => void;
  idError?: string | null;
  fieldErrors?: FieldErrors;
}

export function ResonanceEditor({
  resonanceData,
  onUpdate,
  idError = null,
  fieldErrors = {},
}: ResonanceEditorProps) {
  const handleFieldChange = useCallback(
    (field: keyof ResonanceDefinition, value: string) => {
      onUpdate({ ...resonanceData, [field]: value });
    },
    [resonanceData, onUpdate],
  );

  const handlePartyBonusChange = useCallback(
    (index: number, field: keyof ResonancePartyBonus, value: string | number) => {
      const partyBonus = [...resonanceData.partyBonus];
      partyBonus[index] = { ...partyBonus[index], [field]: value };
      onUpdate({ ...resonanceData, partyBonus });
    },
    [resonanceData, onUpdate],
  );

  const handleAddPartyBonus = useCallback(() => {
    onUpdate({
      ...resonanceData,
      partyBonus: [...resonanceData.partyBonus, { stat: '', bonusPercent: 0 }],
    });
  }, [resonanceData, onUpdate]);

  const handleRemovePartyBonus = useCallback(
    (index: number) => {
      onUpdate({
        ...resonanceData,
        partyBonus: resonanceData.partyBonus.filter((_, itemIndex) => itemIndex !== index),
      });
    },
    [resonanceData, onUpdate],
  );

  return (
    <CatalogEditorLayout
      title="Resonance Editor"
      description="Edit resonance properties and party bonuses. Bonus percentages are displayed as whole numbers but stored as decimals (e.g., 5% = 0.05)."
    >
      <IdentityFields
        idLabel="Resonance ID"
        idValue={resonanceData.resonanceId}
        onIdChange={(value) => handleFieldChange('resonanceId', value)}
        idError={idError}
        idHelperText="Unique identifier for this resonance (e.g. valor)."
        nameValue={resonanceData.displayName}
        onNameChange={(value) => handleFieldChange('displayName', value)}
        descriptionValue={resonanceData.description}
        onDescriptionChange={(value) => handleFieldChange('description', value)}
        descriptionGutter={false}
      />

      <Typography variant="h6" gutterBottom>
        Party Bonuses
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Stat bonuses applied to all party members when this resonance is active.
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Stat</TableCell>
            <TableCell align="right">Bonus (%)</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {resonanceData.partyBonus.map((bonus, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <TextField
                  value={bonus.stat}
                  onChange={(event) => handlePartyBonusChange(idx, 'stat', event.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g., attackPower"
                  error={fieldErrors[`partyBonus.${idx}.stat`] !== undefined}
                  helperText={fieldErrors[`partyBonus.${idx}.stat`]}
                  slotProps={{ htmlInput: { 'aria-label': `Party bonus stat ${idx + 1}` } }}
                />
              </TableCell>
              <TableCell align="right" sx={{ width: 150 }}>
                <PercentField
                  label=""
                  value={bonus.bonusPercent}
                  onChange={(value) => handlePartyBonusChange(idx, 'bonusPercent', value)}
                  error={fieldErrors[`partyBonus.${idx}.bonusPercent`]}
                />
              </TableCell>
              <TableCell sx={{ width: 56 }}>
                <IconButton
                  aria-label={`Remove party bonus ${idx + 1}`}
                  onClick={() => handleRemovePartyBonus(idx)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button startIcon={<AddIcon />} onClick={handleAddPartyBonus} size="small" sx={{ mt: 1 }}>
        Add party bonus
      </Button>
    </CatalogEditorLayout>
  );
}
