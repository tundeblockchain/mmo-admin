import { useCallback } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Divider,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { CombatConstantsData, PowerScalingConstants } from '../../types/catalog';

interface CombatConstantsEditorProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
}

interface PercentFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
}

function PercentField({ label, value, onChange, helperText }: PercentFieldProps) {
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
      label={`${label} (%)`}
      type="number"
      value={displayValue}
      onChange={handleChange}
      size="small"
      fullWidth
      helperText={helperText}
      slotProps={{ htmlInput: { step: 1 } }}
    />
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

function NumberField({ label, value, onChange, step = 1 }: NumberFieldProps) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(event.target.value) || 0);
    },
    [onChange],
  );

  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={handleChange}
      size="small"
      fullWidth
      slotProps={{ htmlInput: { step } }}
    />
  );
}

export function CombatConstantsEditor({ data, onUpdate }: CombatConstantsEditorProps) {
  const handlePowerScalingChange = useCallback(
    (updated: PowerScalingConstants) => {
      onUpdate({ ...data, powerScaling: updated });
    },
    [data, onUpdate],
  );

  const handleCriticalChange = useCallback(
    (field: string, value: number) => {
      const critical = { ...data.critical };
      if (field === 'baseCritChance') {
        critical.baseCritChance = value;
      } else if (field === 'criticalDamageMultiplier') {
        critical.criticalDamageMultiplier = value;
      } else if (field === 'maxLuckCritBonus') {
        critical.critChance = { ...critical.critChance, maxLuckCritBonus: value };
      } else if (field === 'luckConstant') {
        critical.critChance = { ...critical.critChance, luckConstant: value };
      } else if (field === 'luckDivisor') {
        critical.procChance = { ...critical.procChance, luckDivisor: value };
      }
      onUpdate({ ...data, critical });
    },
    [data, onUpdate],
  );

  const handleDefenseChange = useCallback(
    (field: string, value: number) => {
      const defense = { ...data.defense };
      if (field === 'baseConstant') {
        defense.defenseConstant = { ...defense.defenseConstant, baseConstant: value };
      } else if (field === 'levelMultiplier') {
        defense.defenseConstant = { ...defense.defenseConstant, levelMultiplier: value };
      } else if (field === 'armorReductionPerPoint') {
        defense.armorReductionPerPoint = value;
      } else if (field === 'maxArmorReduction') {
        defense.maxArmorReduction = value;
      } else if (field === 'blockDamageReduction') {
        defense.blockDamageReduction = value;
      }
      onUpdate({ ...data, defense });
    },
    [data, onUpdate],
  );

  const handlePvpChange = useCallback(
    (field: string, value: number) => {
      if (!data.pvp) return;
      const pvp = { ...data.pvp };
      if (field === 'globalDamageMultiplier') {
        pvp.globalDamageMultiplier = value;
      } else if (field === 'globalHealingMultiplier') {
        pvp.globalHealingMultiplier = value;
      } else if (field === 'ccDurationMultiplier') {
        pvp.ccDurationMultiplier = value;
      } else if (field === 'executeThresholdModifier') {
        pvp.executeThresholdModifier = value;
      }
      onUpdate({ ...data, pvp });
    },
    [data, onUpdate],
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Combat Constants Editor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Edit combat math constants. Percentages are displayed as whole numbers (e.g., 50 = 50%) but
        stored as decimals (0.50) in the API.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Power Scaling</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom>
                Physical Power
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Strength Multiplier"
                value={data.powerScaling.physicalPower.strengthMultiplier}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    physicalPower: { ...data.powerScaling.physicalPower, strengthMultiplier: v },
                  })
                }
                step={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Level Multiplier"
                value={data.powerScaling.physicalPower.levelMultiplier}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    physicalPower: { ...data.powerScaling.physicalPower, levelMultiplier: v },
                  })
                }
                step={0.1}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Spell Power
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Intellect Multiplier"
                value={data.powerScaling.spellPower.intellectMultiplier}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    spellPower: { ...data.powerScaling.spellPower, intellectMultiplier: v },
                  })
                }
                step={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Level Multiplier"
                value={data.powerScaling.spellPower.levelMultiplier}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    spellPower: { ...data.powerScaling.spellPower, levelMultiplier: v },
                  })
                }
                step={0.1}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Tech Power
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Tech Multiplier"
                value={data.powerScaling.techPower.techMultiplier}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    techPower: { ...data.powerScaling.techPower, techMultiplier: v },
                  })
                }
                step={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Level Multiplier"
                value={data.powerScaling.techPower.levelMultiplier}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    techPower: { ...data.powerScaling.techPower, levelMultiplier: v },
                  })
                }
                step={0.1}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Device Power
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Tech Divisor"
                value={data.powerScaling.devicePower.techDivisor}
                onChange={(v) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    devicePower: { ...data.powerScaling.devicePower, techDivisor: v },
                  })
                }
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Critical</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Base Crit Chance"
                value={data.critical.baseCritChance}
                onChange={(v) => handleCriticalChange('baseCritChance', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Critical Damage Multiplier"
                value={data.critical.criticalDamageMultiplier}
                onChange={(v) => handleCriticalChange('criticalDamageMultiplier', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Max Luck Crit Bonus"
                value={data.critical.critChance.maxLuckCritBonus}
                onChange={(v) => handleCriticalChange('maxLuckCritBonus', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Luck Constant"
                value={data.critical.critChance.luckConstant}
                onChange={(v) => handleCriticalChange('luckConstant', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Proc Luck Divisor"
                value={data.critical.procChance.luckDivisor}
                onChange={(v) => handleCriticalChange('luckDivisor', v)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Defense</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Defense Base Constant"
                value={data.defense.defenseConstant.baseConstant}
                onChange={(v) => handleDefenseChange('baseConstant', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Defense Level Multiplier"
                value={data.defense.defenseConstant.levelMultiplier}
                onChange={(v) => handleDefenseChange('levelMultiplier', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Armor Reduction/Point"
                value={data.defense.armorReductionPerPoint}
                onChange={(v) => handleDefenseChange('armorReductionPerPoint', v)}
                step={0.001}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Max Armor Reduction"
                value={data.defense.maxArmorReduction}
                onChange={(v) => handleDefenseChange('maxArmorReduction', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Block Damage Reduction"
                value={data.defense.blockDamageReduction}
                onChange={(v) => handleDefenseChange('blockDamageReduction', v)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {data.pvp && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">PvP</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {data.pvp.globalDamageMultiplier !== undefined && (
                <Grid size={{ xs: 6, md: 3 }}>
                  <PercentField
                    label="Global Damage Multiplier"
                    value={data.pvp.globalDamageMultiplier}
                    onChange={(v) => handlePvpChange('globalDamageMultiplier', v)}
                  />
                </Grid>
              )}
              {data.pvp.globalHealingMultiplier !== undefined && (
                <Grid size={{ xs: 6, md: 3 }}>
                  <PercentField
                    label="Global Healing Multiplier"
                    value={data.pvp.globalHealingMultiplier}
                    onChange={(v) => handlePvpChange('globalHealingMultiplier', v)}
                  />
                </Grid>
              )}
              {data.pvp.ccDurationMultiplier !== undefined && (
                <Grid size={{ xs: 6, md: 3 }}>
                  <PercentField
                    label="CC Duration Multiplier"
                    value={data.pvp.ccDurationMultiplier}
                    onChange={(v) => handlePvpChange('ccDurationMultiplier', v)}
                  />
                </Grid>
              )}
              {data.pvp.executeThresholdModifier !== undefined && (
                <Grid size={{ xs: 6, md: 3 }}>
                  <PercentField
                    label="Execute Threshold Modifier"
                    value={data.pvp.executeThresholdModifier}
                    onChange={(v) => handlePvpChange('executeThresholdModifier', v)}
                  />
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
}
