import { useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import type { ResonanceDefinition, ResonancePartyBonus } from '../../types/catalog';

interface ResonanceEditorProps {
  resonanceData: ResonanceDefinition;
  onUpdate: (updated: ResonanceDefinition) => void;
}

interface PercentFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function PercentField({ label, value, onChange }: PercentFieldProps) {
  const displayValue = (value * 100).toFixed(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const percentValue = parseFloat(event.target.value) || 0;
      onChange(percentValue / 100);
    },
    [onChange],
  );

  return (
    <TextField
      label={label}
      type="number"
      value={displayValue}
      onChange={handleChange}
      size="small"
      fullWidth
      slotProps={{ htmlInput: { step: 1 } }}
    />
  );
}

export function ResonanceEditor({ resonanceData, onUpdate }: ResonanceEditorProps) {
  const handleTextChange = useCallback(
    (field: keyof ResonanceDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...resonanceData, [field]: event.target.value });
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Resonance Editor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Edit resonance properties and party bonuses. Bonus percentages are displayed as whole numbers
        but stored as decimals (e.g., 5% = 0.05).
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Display Name"
          value={resonanceData.displayName}
          onChange={handleTextChange('displayName')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={resonanceData.description}
          onChange={handleTextChange('description')}
          fullWidth
          multiline
          rows={2}
          size="small"
        />
      </Box>

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
          </TableRow>
        </TableHead>
        <TableBody>
          {resonanceData.partyBonus.map((bonus, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <TextField
                  value={bonus.stat}
                  onChange={(e) => handlePartyBonusChange(idx, 'stat', e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g., attackPower"
                />
              </TableCell>
              <TableCell align="right" sx={{ width: 150 }}>
                <PercentField
                  label=""
                  value={bonus.bonusPercent}
                  onChange={(v) => handlePartyBonusChange(idx, 'bonusPercent', v)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
