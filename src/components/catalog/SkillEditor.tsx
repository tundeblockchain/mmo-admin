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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  type SelectChangeEvent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type {
  SkillDefinition,
  SkillKind,
  ElementId,
  ScalingStat,
  ScalingVector,
  SkillTiming,
  StaggerCoefficients,
  PvPMultipliers,
  ClassId,
} from '../../types/catalog';

interface SkillEditorProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
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

const SKILL_KINDS: SkillKind[] = ['active', 'passive', 'reaction'];
const ELEMENTS: ElementId[] = ['physical', 'fire', 'ice', 'lightning', 'arcane', 'nature', 'shadow', 'radiant'];
const CLASSES: ClassId[] = ['vanguard', 'ranger', 'arcanist', 'machinist', 'warden', 'shade'];
const SCALING_STATS: ScalingStat[] = [
  'attackPower', 'spellPower', 'techPower', 'devicePower', 'healingPower',
  'maxHp', 'missingHp', 'missingHpPercent', 'armor', 'level',
  'strength', 'finesse', 'vitality', 'intellect', 'precision', 'luck', 'tech',
];

export function SkillEditor({ skillData, onUpdate }: SkillEditorProps) {
  const handleTextChange = useCallback(
    (field: keyof SkillDefinition) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...skillData, [field]: event.target.value });
    },
    [skillData, onUpdate],
  );

  const handleNumberChange = useCallback(
    (field: keyof SkillDefinition) => (value: number) => {
      onUpdate({ ...skillData, [field]: value });
    },
    [skillData, onUpdate],
  );

  const handleBooleanChange = useCallback(
    (field: keyof SkillDefinition) => (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onUpdate({ ...skillData, [field]: checked });
    },
    [skillData, onUpdate],
  );

  const handleKindChange = useCallback(
    (event: SelectChangeEvent<SkillKind>) => {
      onUpdate({ ...skillData, kind: event.target.value as SkillKind });
    },
    [skillData, onUpdate],
  );

  const handleClassChange = useCallback(
    (event: SelectChangeEvent<ClassId>) => {
      onUpdate({ ...skillData, classId: event.target.value as ClassId });
    },
    [skillData, onUpdate],
  );

  const handleCoefficientsChange = useCallback(
    (field: string, value: number | string | undefined) => {
      const coefficients = { ...skillData.coefficients };
      if (field === 'basePower') {
        coefficients.basePower = value as number;
      } else if (field === 'element') {
        coefficients.element = value as ElementId | undefined;
      }
      onUpdate({ ...skillData, coefficients });
    },
    [skillData, onUpdate],
  );

  const handleScalingChange = useCallback(
    (index: number, field: keyof ScalingVector, value: ScalingStat | number) => {
      const scaling = [...skillData.coefficients.scaling];
      scaling[index] = { ...scaling[index], [field]: value };
      onUpdate({
        ...skillData,
        coefficients: { ...skillData.coefficients, scaling },
      });
    },
    [skillData, onUpdate],
  );

  const handleTimingChange = useCallback(
    (field: keyof SkillTiming, value: number) => {
      const timing = skillData.timing ?? { castMs: 0, activeMs: 0, recoveryMs: 0 };
      onUpdate({
        ...skillData,
        timing: { ...timing, [field]: value },
      });
    },
    [skillData, onUpdate],
  );

  const handleStaggerChange = useCallback(
    (field: keyof StaggerCoefficients, value: number | boolean) => {
      const stagger = skillData.stagger ?? { staggerPower: 0, canStagger: false };
      onUpdate({
        ...skillData,
        stagger: { ...stagger, [field]: value },
      });
    },
    [skillData, onUpdate],
  );

  const handlePvpMultiplierChange = useCallback(
    (field: keyof PvPMultipliers, value: number) => {
      const pvpMultipliers = skillData.pvpMultipliers ?? {};
      onUpdate({
        ...skillData,
        pvpMultipliers: { ...pvpMultipliers, [field]: value },
      });
    },
    [skillData, onUpdate],
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Skill Editor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Edit skill properties. Percentages are displayed as whole numbers but stored as decimals in the API.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Display Name"
          value={skillData.displayName}
          onChange={handleTextChange('displayName')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={skillData.description}
          onChange={handleTextChange('description')}
          fullWidth
          multiline
          rows={2}
          size="small"
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="skill-kind-label">Kind</InputLabel>
              <Select
                labelId="skill-kind-label"
                value={skillData.kind}
                label="Kind"
                onChange={handleKindChange}
              >
                {SKILL_KINDS.map((kind) => (
                  <MenuItem key={kind} value={kind}>
                    {kind}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="skill-class-label">Class</InputLabel>
              <Select
                labelId="skill-class-label"
                value={skillData.classId}
                label="Class"
                onChange={handleClassChange}
              >
                {CLASSES.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <NumberField
              label="Unlock Level"
              value={skillData.unlockLevel}
              onChange={handleNumberChange('unlockLevel')}
            />
          </Grid>
        </Grid>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Basic Properties</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Resource Cost"
                value={skillData.resourceCost}
                onChange={handleNumberChange('resourceCost')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Cooldown (seconds)"
                value={skillData.cooldownSeconds}
                onChange={handleNumberChange('cooldownSeconds')}
                step={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Charges"
                value={skillData.charges}
                onChange={handleNumberChange('charges')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Cast Time (seconds)"
                value={skillData.castTimeSeconds}
                onChange={handleNumberChange('castTimeSeconds')}
                step={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Range"
                value={skillData.range}
                onChange={handleNumberChange('range')}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={skillData.castableWhileMoving}
                    onChange={handleBooleanChange('castableWhileMoving')}
                  />
                }
                label="Castable While Moving"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Coefficients</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Base Power"
                value={skillData.coefficients.basePower}
                onChange={(v) => handleCoefficientsChange('basePower', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="skill-element-label">Element</InputLabel>
                <Select<ElementId | ''>
                  labelId="skill-element-label"
                  value={skillData.coefficients.element ?? ''}
                  label="Element"
                  onChange={(e) =>
                    handleCoefficientsChange(
                      'element',
                      e.target.value === '' ? undefined : (e.target.value as ElementId),
                    )
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {ELEMENTS.map((el) => (
                    <MenuItem key={el} value={el}>
                      {el}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {skillData.coefficients.scaling.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Scaling
              </Typography>
              {skillData.coefficients.scaling.map((scale, idx) => (
                <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`scaling-stat-${idx}-label`}>Stat</InputLabel>
                      <Select
                        labelId={`scaling-stat-${idx}-label`}
                        value={scale.stat}
                        label="Stat"
                        onChange={(e) =>
                          handleScalingChange(idx, 'stat', e.target.value as ScalingStat)
                        }
                      >
                        {SCALING_STATS.map((stat) => (
                          <MenuItem key={stat} value={stat}>
                            {stat}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <NumberField
                      label="Coefficient"
                      value={scale.coefficient}
                      onChange={(v) => handleScalingChange(idx, 'coefficient', v)}
                      step={0.01}
                    />
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Timing (ms)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 4 }}>
              <NumberField
                label="Cast (ms)"
                value={skillData.timing?.castMs ?? 0}
                onChange={(v) => handleTimingChange('castMs', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <NumberField
                label="Active (ms)"
                value={skillData.timing?.activeMs ?? 0}
                onChange={(v) => handleTimingChange('activeMs', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <NumberField
                label="Recovery (ms)"
                value={skillData.timing?.recoveryMs ?? 0}
                onChange={(v) => handleTimingChange('recoveryMs', v)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Stagger</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 4 }}>
              <NumberField
                label="Stagger Power"
                value={skillData.stagger?.staggerPower ?? 0}
                onChange={(v) => handleStaggerChange('staggerPower', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={skillData.stagger?.canStagger ?? false}
                    onChange={(_, checked) => handleStaggerChange('canStagger', checked)}
                  />
                }
                label="Can Stagger"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">PvP Multipliers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Multipliers applied to this skill in PvP. Values are stored as decimals (e.g., 0.80 = 80%).
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Damage Multiplier"
                value={skillData.pvpMultipliers?.damageMultiplier ?? 1}
                onChange={(v) => handlePvpMultiplierChange('damageMultiplier', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Healing Multiplier"
                value={skillData.pvpMultipliers?.healingMultiplier ?? 1}
                onChange={(v) => handlePvpMultiplierChange('healingMultiplier', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Duration Multiplier"
                value={skillData.pvpMultipliers?.durationMultiplier ?? 1}
                onChange={(v) => handlePvpMultiplierChange('durationMultiplier', v)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Cooldown Multiplier"
                value={skillData.pvpMultipliers?.cooldownMultiplier ?? 1}
                onChange={(v) => handlePvpMultiplierChange('cooldownMultiplier', v)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
