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
  Button,
  IconButton,
  type SelectChangeEvent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ACTIVE_PHASE_TYPES,
  CLASS_IDS,
  ELEMENT_IDS,
  RESOURCE_IDS,
  SCALING_STATS,
  SKILL_CONDITIONS,
  SKILL_KINDS,
} from '../../lib/catalogSchema';
import type { FieldErrors } from '../../lib/catalogValidation';
import {
  NumberField,
  OptionalNumberField,
  OptionalPercentField,
  PercentField,
} from './catalogFields';
import type {
  ActivePhaseType,
  ClassId,
  ElementId,
  PvPMultipliers,
  ResourceEffect,
  ScalingStat,
  ScalingVector,
  SkillCondition,
  SkillConditional,
  SkillDefinition,
  SkillKind,
  SkillTiming,
  StaggerCoefficients,
} from '../../types/catalog';

interface SkillEditorProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  idError?: string | null;
  fieldErrors?: FieldErrors;
}

function createResourceEffect(): ResourceEffect {
  return {
    resourceId: '',
    amount: 0,
    isPercentOfMax: false,
  };
}

function createConditional(): SkillConditional {
  return { condition: 'marked' };
}

function createScaling(): ScalingVector {
  return { stat: 'attackPower', coefficient: 1 };
}

export function SkillEditor({
  skillData,
  onUpdate,
  idError = null,
  fieldErrors = {},
}: SkillEditorProps) {
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

  const handleOptionalNumberChange = useCallback(
    (field: keyof SkillDefinition) => (value: number | undefined) => {
      onUpdate({ ...skillData, [field]: value });
    },
    [skillData, onUpdate],
  );

  const handleBooleanChange = useCallback(
    (field: keyof SkillDefinition) =>
      (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
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

  const handleResourceIdChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const next = event.target.value;
      onUpdate({ ...skillData, resourceId: next === '' ? null : next });
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
      } else if (field === 'appliesStatus') {
        const text = value as string;
        coefficients.appliesStatus = text === '' ? undefined : text;
      } else if (field === 'effectDuration') {
        coefficients.effectDuration = value as number | undefined;
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

  const handleAddScaling = useCallback(() => {
    onUpdate({
      ...skillData,
      coefficients: {
        ...skillData.coefficients,
        scaling: [...skillData.coefficients.scaling, createScaling()],
      },
    });
  }, [skillData, onUpdate]);

  const handleRemoveScaling = useCallback(
    (index: number) => {
      onUpdate({
        ...skillData,
        coefficients: {
          ...skillData.coefficients,
          scaling: skillData.coefficients.scaling.filter((_, itemIndex) => itemIndex !== index),
        },
      });
    },
    [skillData, onUpdate],
  );

  const handleStackChange = useCallback(
    (index: number, value: number) => {
      const currentStacks = skillData.coefficients.perStack?.basePowerPerStack ?? [];
      const basePowerPerStack = [...currentStacks];
      basePowerPerStack[index] = value;
      onUpdate({
        ...skillData,
        coefficients: {
          ...skillData.coefficients,
          perStack: {
            ...skillData.coefficients.perStack,
            basePowerPerStack,
          },
        },
      });
    },
    [skillData, onUpdate],
  );

  const handleAddStack = useCallback(() => {
    const currentStacks = skillData.coefficients.perStack?.basePowerPerStack ?? [];
    onUpdate({
      ...skillData,
      coefficients: {
        ...skillData.coefficients,
        perStack: {
          ...skillData.coefficients.perStack,
          basePowerPerStack: [...currentStacks, 1],
        },
      },
    });
  }, [skillData, onUpdate]);

  const handleRemoveStack = useCallback(
    (index: number) => {
      const currentStacks = skillData.coefficients.perStack?.basePowerPerStack ?? [];
      const basePowerPerStack = currentStacks.filter((_, itemIndex) => itemIndex !== index);
      onUpdate({
        ...skillData,
        coefficients: {
          ...skillData.coefficients,
          perStack:
            basePowerPerStack.length === 0
              ? undefined
              : { ...skillData.coefficients.perStack, basePowerPerStack },
        },
      });
    },
    [skillData, onUpdate],
  );

  const handleConditionalChange = useCallback(
    (index: number, next: SkillConditional) => {
      const conditionals = [...(skillData.coefficients.conditionals ?? [])];
      conditionals[index] = next;
      onUpdate({
        ...skillData,
        coefficients: { ...skillData.coefficients, conditionals },
      });
    },
    [skillData, onUpdate],
  );

  const handleAddConditional = useCallback(() => {
    onUpdate({
      ...skillData,
      coefficients: {
        ...skillData.coefficients,
        conditionals: [...(skillData.coefficients.conditionals ?? []), createConditional()],
      },
    });
  }, [skillData, onUpdate]);

  const handleRemoveConditional = useCallback(
    (index: number) => {
      const conditionals = (skillData.coefficients.conditionals ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      );
      onUpdate({
        ...skillData,
        coefficients: {
          ...skillData.coefficients,
          conditionals: conditionals.length === 0 ? undefined : conditionals,
        },
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

  const handleActivePhaseTypeChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const timing = skillData.timing ?? { castMs: 0, activeMs: 0, recoveryMs: 0 };
      const next = event.target.value;
      onUpdate({
        ...skillData,
        timing: {
          ...timing,
          activePhaseType: next === '' ? undefined : (next as ActivePhaseType),
        },
      });
    },
    [skillData, onUpdate],
  );

  const handleStaggerChange = useCallback(
    (field: keyof StaggerCoefficients, value: number | boolean | undefined) => {
      const stagger = skillData.stagger ?? { staggerPower: 0, canStagger: false };
      onUpdate({
        ...skillData,
        stagger: { ...stagger, [field]: value },
      });
    },
    [skillData, onUpdate],
  );

  const handleBonusStaggerChange = useCallback(
    (field: 'condition' | 'value', value: string | number) => {
      const stagger = skillData.stagger ?? { staggerPower: 0, canStagger: false };
      const bonusStagger = stagger.bonusStagger ?? { condition: '', value: 0 };
      onUpdate({
        ...skillData,
        stagger: { ...stagger, bonusStagger: { ...bonusStagger, [field]: value } },
      });
    },
    [skillData, onUpdate],
  );

  const handleStatusBuildupChange = useCallback(
    (field: 'status' | 'value', value: string | number) => {
      const stagger = skillData.stagger ?? { staggerPower: 0, canStagger: false };
      const statusBuildup = stagger.statusBuildup ?? { status: '', value: 0 };
      onUpdate({
        ...skillData,
        stagger: { ...stagger, statusBuildup: { ...statusBuildup, [field]: value } },
      });
    },
    [skillData, onUpdate],
  );

  const handlePvpMultiplierChange = useCallback(
    (field: keyof PvPMultipliers, value: number | undefined) => {
      const pvpMultipliers = skillData.pvpMultipliers ?? {};
      onUpdate({
        ...skillData,
        pvpMultipliers: { ...pvpMultipliers, [field]: value },
      });
    },
    [skillData, onUpdate],
  );

  const handleResourceOverrideChange = useCallback(
    (field: 'resourceId' | 'amount', value: string | number) => {
      const pvpMultipliers = skillData.pvpMultipliers ?? {};
      const resourceOverride = pvpMultipliers.resourceOverride ?? { resourceId: '', amount: 0 };
      onUpdate({
        ...skillData,
        pvpMultipliers: {
          ...pvpMultipliers,
          resourceOverride: { ...resourceOverride, [field]: value },
        },
      });
    },
    [skillData, onUpdate],
  );

  const handleEffectOverrideChange = useCallback(
    (key: string, nextKey: string, value: number) => {
      const pvpMultipliers = skillData.pvpMultipliers ?? {};
      const effectOverrides = { ...pvpMultipliers.effectOverrides };
      if (key !== nextKey) {
        delete effectOverrides[key];
      }
      if (nextKey !== '' || key !== '') {
        effectOverrides[nextKey] = value;
      }
      onUpdate({
        ...skillData,
        pvpMultipliers: { ...pvpMultipliers, effectOverrides },
      });
    },
    [skillData, onUpdate],
  );

  const handleAddEffectOverride = useCallback(() => {
    const pvpMultipliers = skillData.pvpMultipliers ?? {};
    onUpdate({
      ...skillData,
      pvpMultipliers: {
        ...pvpMultipliers,
        effectOverrides: { ...pvpMultipliers.effectOverrides, '': 0 },
      },
    });
  }, [skillData, onUpdate]);

  const handleRemoveEffectOverride = useCallback(
    (key: string) => {
      const pvpMultipliers = skillData.pvpMultipliers ?? {};
      const effectOverrides = { ...pvpMultipliers.effectOverrides };
      delete effectOverrides[key];
      onUpdate({
        ...skillData,
        pvpMultipliers: {
          ...pvpMultipliers,
          effectOverrides: Object.keys(effectOverrides).length === 0 ? undefined : effectOverrides,
        },
      });
    },
    [skillData, onUpdate],
  );

  const handleResourceEffectChange = useCallback(
    (index: number, next: ResourceEffect) => {
      const resourceEffects = [...(skillData.resourceEffects ?? [])];
      resourceEffects[index] = next;
      onUpdate({ ...skillData, resourceEffects });
    },
    [skillData, onUpdate],
  );

  const handleAddResourceEffect = useCallback(() => {
    onUpdate({
      ...skillData,
      resourceEffects: [...(skillData.resourceEffects ?? []), createResourceEffect()],
    });
  }, [skillData, onUpdate]);

  const handleRemoveResourceEffect = useCallback(
    (index: number) => {
      const resourceEffects = (skillData.resourceEffects ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      );
      onUpdate({
        ...skillData,
        resourceEffects: resourceEffects.length === 0 ? undefined : resourceEffects,
      });
    },
    [skillData, onUpdate],
  );

  const classOptions = CLASS_IDS.includes(skillData.classId as (typeof CLASS_IDS)[number])
    ? CLASS_IDS
    : [...CLASS_IDS, skillData.classId];
  const resourceOptions = skillData.resourceId && !RESOURCE_IDS.includes(skillData.resourceId as (typeof RESOURCE_IDS)[number])
    ? [...RESOURCE_IDS, skillData.resourceId]
    : RESOURCE_IDS;
  const effectOverrides = Object.entries(skillData.pvpMultipliers?.effectOverrides ?? {});

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
          label="Skill ID"
          value={skillData.skillId}
          onChange={handleTextChange('skillId')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          error={idError !== null}
          helperText={idError ?? 'Unique identifier for this skill (e.g. vanguard_cleaving_strike).'}
        />
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
        <TextField
          label="Icon Path"
          value={skillData.iconPath}
          onChange={handleTextChange('iconPath')}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          helperText="Asset path stored on the skill (e.g. icons/skills/vanguard/cleaving_strike.png)."
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
                {classOptions.map((cls) => (
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
              error={fieldErrors.unlockLevel}
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
              <FormControl fullWidth size="small">
                <InputLabel id="skill-resource-label">Resource</InputLabel>
                <Select
                  labelId="skill-resource-label"
                  value={skillData.resourceId ?? ''}
                  label="Resource"
                  onChange={handleResourceIdChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {resourceOptions.map((resource) => (
                    <MenuItem key={resource} value={resource}>
                      {resource}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Resource Cost"
                value={skillData.resourceCost}
                onChange={handleNumberChange('resourceCost')}
                error={fieldErrors.resourceCost}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Cooldown (seconds)"
                value={skillData.cooldownSeconds}
                onChange={handleNumberChange('cooldownSeconds')}
                step={0.1}
                error={fieldErrors.cooldownSeconds}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Internal Cooldown (seconds)"
                value={skillData.internalCooldownSeconds}
                onChange={handleOptionalNumberChange('internalCooldownSeconds')}
                step={0.1}
                error={fieldErrors.internalCooldownSeconds}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Charges"
                value={skillData.charges}
                onChange={handleNumberChange('charges')}
                error={fieldErrors.charges}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Charge Recharge (seconds)"
                value={skillData.chargeRechargeSeconds}
                onChange={handleNumberChange('chargeRechargeSeconds')}
                step={0.1}
                error={fieldErrors.chargeRechargeSeconds}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Cast Time (seconds)"
                value={skillData.castTimeSeconds}
                onChange={handleNumberChange('castTimeSeconds')}
                step={0.1}
                error={fieldErrors.castTimeSeconds}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Range"
                value={skillData.range}
                onChange={handleNumberChange('range')}
                error={fieldErrors.range}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Anti-Death Duration (seconds)"
                value={skillData.antiDeathDurationSeconds}
                onChange={handleOptionalNumberChange('antiDeathDurationSeconds')}
                step={0.1}
                error={fieldErrors.antiDeathDurationSeconds}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Exhausted Duration (seconds)"
                value={skillData.exhaustedDurationSeconds}
                onChange={handleOptionalNumberChange('exhaustedDurationSeconds')}
                step={0.1}
                error={fieldErrors.exhaustedDurationSeconds}
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
          <Typography variant="h6">Resource Effects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Generation and consumption effects. Amount is a decimal; check percent-of-max to treat
            it as a fraction of the resource pool (0.10 = 10%).
          </Typography>
          {(skillData.resourceEffects ?? []).map((effect, index) => (
            <Grid container spacing={2} key={`resource-effect-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Resource ID"
                  value={effect.resourceId}
                  onChange={(event) =>
                    handleResourceEffectChange(index, { ...effect, resourceId: event.target.value })
                  }
                  size="small"
                  fullWidth
                  error={fieldErrors[`resourceEffects.${index}.resourceId`] !== undefined}
                  helperText={fieldErrors[`resourceEffects.${index}.resourceId`]}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <NumberField
                  label="Amount"
                  value={effect.amount}
                  onChange={(value) => handleResourceEffectChange(index, { ...effect, amount: value })}
                  step={0.1}
                  error={fieldErrors[`resourceEffects.${index}.amount`]}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <OptionalNumberField
                  label="Per-Target Bonus"
                  value={effect.perTargetBonus}
                  onChange={(value) =>
                    handleResourceEffectChange(index, { ...effect, perTargetBonus: value })
                  }
                  step={0.1}
                  error={fieldErrors[`resourceEffects.${index}.perTargetBonus`]}
                />
              </Grid>
              <Grid size={{ xs: 8, sm: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={effect.isPercentOfMax}
                      onChange={(_, checked) =>
                        handleResourceEffectChange(index, { ...effect, isPercentOfMax: checked })
                      }
                    />
                  }
                  label="Percent of max"
                />
              </Grid>
              <Grid size={{ xs: 4, sm: 1 }}>
                <IconButton
                  aria-label={`Remove resource effect ${index + 1}`}
                  onClick={() => handleRemoveResourceEffect(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddResourceEffect} size="small">
            Add resource effect
          </Button>
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
                onChange={(value) => handleCoefficientsChange('basePower', value)}
                error={fieldErrors['coefficients.basePower']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="skill-element-label">Element</InputLabel>
                <Select<ElementId | ''>
                  labelId="skill-element-label"
                  value={skillData.coefficients.element ?? ''}
                  label="Element"
                  onChange={(event) =>
                    handleCoefficientsChange(
                      'element',
                      event.target.value === '' ? undefined : (event.target.value as ElementId),
                    )
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {ELEMENT_IDS.map((element) => (
                    <MenuItem key={element} value={element}>
                      {element}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                label="Applies Status"
                value={skillData.coefficients.appliesStatus ?? ''}
                onChange={(event) => handleCoefficientsChange('appliesStatus', event.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Effect Duration (seconds)"
                value={skillData.coefficients.effectDuration}
                onChange={(value) => handleCoefficientsChange('effectDuration', value)}
                step={0.1}
                error={fieldErrors['coefficients.effectDuration']}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Scaling
            </Typography>
            {skillData.coefficients.scaling.map((scale, index) => (
              <Grid container spacing={2} key={`scaling-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid size={{ xs: 6, md: 5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`scaling-stat-${index}-label`}>Stat</InputLabel>
                    <Select
                      labelId={`scaling-stat-${index}-label`}
                      value={scale.stat}
                      label="Stat"
                      onChange={(event) =>
                        handleScalingChange(index, 'stat', event.target.value as ScalingStat)
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
                <Grid size={{ xs: 5, md: 5 }}>
                  <NumberField
                    label="Coefficient"
                    value={scale.coefficient}
                    onChange={(value) => handleScalingChange(index, 'coefficient', value)}
                    step={0.01}
                    error={fieldErrors[`coefficients.scaling.${index}.coefficient`]}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton
                    aria-label={`Remove scaling ${scale.stat}`}
                    onClick={() => handleRemoveScaling(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddScaling} size="small">
              Add scaling
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Per-Stack Values
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Index 0 is 1 stack. Values are posted as decimals.
            </Typography>
            {(skillData.coefficients.perStack?.basePowerPerStack ?? []).map((value, index) => (
              <Grid container spacing={2} key={`stack-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid size={{ xs: 10, md: 6 }}>
                  <NumberField
                    label={`Stack ${index + 1} base power`}
                    value={value}
                    onChange={(next) => handleStackChange(index, next)}
                    step={0.01}
                    error={fieldErrors[`coefficients.perStack.basePowerPerStack.${index}`]}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <IconButton
                    aria-label={`Remove stack ${index + 1}`}
                    onClick={() => handleRemoveStack(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddStack} size="small">
              Add stack value
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Conditionals
            </Typography>
            {(skillData.coefficients.conditionals ?? []).map((conditional, index) => (
              <Grid container spacing={2} key={`conditional-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small" error={fieldErrors[`coefficients.conditionals.${index}.condition`] !== undefined}>
                    <InputLabel id={`conditional-${index}-label`}>Condition</InputLabel>
                    <Select
                      labelId={`conditional-${index}-label`}
                      value={conditional.condition}
                      label="Condition"
                      onChange={(event) =>
                        handleConditionalChange(index, {
                          ...conditional,
                          condition: event.target.value as SkillCondition,
                        })
                      }
                    >
                      {SKILL_CONDITIONS.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                          {condition}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <OptionalPercentField
                    label="Threshold"
                    value={conditional.threshold}
                    onChange={(value) => handleConditionalChange(index, { ...conditional, threshold: value })}
                    error={fieldErrors[`coefficients.conditionals.${index}.threshold`]}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <OptionalNumberField
                    label="Base Power"
                    value={conditional.basePower}
                    onChange={(value) => handleConditionalChange(index, { ...conditional, basePower: value })}
                    step={0.01}
                    error={fieldErrors[`coefficients.conditionals.${index}.basePower`]}
                  />
                </Grid>
                <Grid size={{ xs: 10, sm: 3 }}>
                  <OptionalNumberField
                    label="Damage Multiplier"
                    value={conditional.damageMultiplier}
                    onChange={(value) =>
                      handleConditionalChange(index, { ...conditional, damageMultiplier: value })
                    }
                    step={0.01}
                    error={fieldErrors[`coefficients.conditionals.${index}.damageMultiplier`]}
                  />
                </Grid>
                <Grid size={{ xs: 2, sm: 1 }}>
                  <IconButton
                    aria-label={`Remove conditional ${index + 1}`}
                    onClick={() => handleRemoveConditional(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddConditional} size="small">
              Add conditional
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Timing (ms)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Cast (ms)"
                value={skillData.timing?.castMs ?? 0}
                onChange={(value) => handleTimingChange('castMs', value)}
                error={fieldErrors['timing.castMs']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Active (ms)"
                value={skillData.timing?.activeMs ?? 0}
                onChange={(value) => handleTimingChange('activeMs', value)}
                error={fieldErrors['timing.activeMs']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Recovery (ms)"
                value={skillData.timing?.recoveryMs ?? 0}
                onChange={(value) => handleTimingChange('recoveryMs', value)}
                error={fieldErrors['timing.recoveryMs']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="active-phase-type-label">Active Phase Type</InputLabel>
                <Select
                  labelId="active-phase-type-label"
                  value={skillData.timing?.activePhaseType ?? ''}
                  label="Active Phase Type"
                  onChange={handleActivePhaseTypeChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {ACTIVE_PHASE_TYPES.map((phase) => (
                    <MenuItem key={phase} value={phase}>
                      {phase}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Stagger Power"
                value={skillData.stagger?.staggerPower ?? 0}
                onChange={(value) => handleStaggerChange('staggerPower', value)}
                error={fieldErrors['stagger.staggerPower']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Stagger Resist"
                value={skillData.stagger?.staggerResist}
                onChange={(value) => handleStaggerChange('staggerResist', value)}
                error={fieldErrors['stagger.staggerResist']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Per-Stack Stagger"
                value={skillData.stagger?.perStackStagger}
                onChange={(value) => handleStaggerChange('perStackStagger', value)}
                error={fieldErrors['stagger.perStackStagger']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Stagger Per Hit"
                value={skillData.stagger?.staggerPerHit}
                onChange={(value) => handleStaggerChange('staggerPerHit', value)}
                error={fieldErrors['stagger.staggerPerHit']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
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
            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                label="Bonus Stagger Condition"
                value={skillData.stagger?.bonusStagger?.condition ?? ''}
                onChange={(event) => handleBonusStaggerChange('condition', event.target.value)}
                size="small"
                fullWidth
                error={fieldErrors['stagger.bonusStagger.condition'] !== undefined}
                helperText={fieldErrors['stagger.bonusStagger.condition']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Bonus Stagger Value"
                value={skillData.stagger?.bonusStagger?.value ?? 0}
                onChange={(value) => handleBonusStaggerChange('value', value)}
                error={fieldErrors['stagger.bonusStagger.value']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                label="Status Buildup"
                value={skillData.stagger?.statusBuildup?.status ?? ''}
                onChange={(event) => handleStatusBuildupChange('status', event.target.value)}
                size="small"
                fullWidth
                error={fieldErrors['stagger.statusBuildup.status'] !== undefined}
                helperText={fieldErrors['stagger.statusBuildup.status']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Status Buildup Value"
                value={skillData.stagger?.statusBuildup?.value ?? 0}
                onChange={(value) => handleStatusBuildupChange('value', value)}
                error={fieldErrors['stagger.statusBuildup.value']}
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
                onChange={(value) => handlePvpMultiplierChange('damageMultiplier', value)}
                error={fieldErrors['pvpMultipliers.damageMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Healing Multiplier"
                value={skillData.pvpMultipliers?.healingMultiplier ?? 1}
                onChange={(value) => handlePvpMultiplierChange('healingMultiplier', value)}
                error={fieldErrors['pvpMultipliers.healingMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Duration Multiplier"
                value={skillData.pvpMultipliers?.durationMultiplier ?? 1}
                onChange={(value) => handlePvpMultiplierChange('durationMultiplier', value)}
                error={fieldErrors['pvpMultipliers.durationMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Cooldown Multiplier"
                value={skillData.pvpMultipliers?.cooldownMultiplier ?? 1}
                onChange={(value) => handlePvpMultiplierChange('cooldownMultiplier', value)}
                error={fieldErrors['pvpMultipliers.cooldownMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Duration (seconds)"
                value={skillData.pvpMultipliers?.durationSeconds}
                onChange={(value) => handlePvpMultiplierChange('durationSeconds', value)}
                step={0.1}
                error={fieldErrors['pvpMultipliers.durationSeconds']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Cooldown (seconds)"
                value={skillData.pvpMultipliers?.cooldownSeconds}
                onChange={(value) => handlePvpMultiplierChange('cooldownSeconds', value)}
                step={0.1}
                error={fieldErrors['pvpMultipliers.cooldownSeconds']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Stagger Multiplier"
                value={skillData.pvpMultipliers?.staggerMultiplier}
                onChange={(value) => handlePvpMultiplierChange('staggerMultiplier', value)}
                error={fieldErrors['pvpMultipliers.staggerMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Max Targets"
                value={skillData.pvpMultipliers?.maxTargets}
                onChange={(value) => handlePvpMultiplierChange('maxTargets', value)}
                error={fieldErrors['pvpMultipliers.maxTargets']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Max Hits Per Target"
                value={skillData.pvpMultipliers?.maxHitsPerTarget}
                onChange={(value) => handlePvpMultiplierChange('maxHitsPerTarget', value)}
                error={fieldErrors['pvpMultipliers.maxHitsPerTarget']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                label="Resource Override ID"
                value={skillData.pvpMultipliers?.resourceOverride?.resourceId ?? ''}
                onChange={(event) => handleResourceOverrideChange('resourceId', event.target.value)}
                size="small"
                fullWidth
                error={fieldErrors['pvpMultipliers.resourceOverride.resourceId'] !== undefined}
                helperText={fieldErrors['pvpMultipliers.resourceOverride.resourceId']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Resource Override Amount"
                value={skillData.pvpMultipliers?.resourceOverride?.amount ?? 0}
                onChange={(value) => handleResourceOverrideChange('amount', value)}
                error={fieldErrors['pvpMultipliers.resourceOverride.amount']}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Effect Overrides
            </Typography>
            {effectOverrides.map(([key, value], index) => (
              <Grid container spacing={2} key={`effect-override-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid size={{ xs: 5 }}>
                  <TextField
                    label="Override Key"
                    value={key}
                    onChange={(event) => handleEffectOverrideChange(key, event.target.value, value)}
                    size="small"
                    fullWidth
                    error={key.trim() === '' && fieldErrors['pvpMultipliers.effectOverrides.key'] !== undefined}
                    helperText={key.trim() === '' ? fieldErrors['pvpMultipliers.effectOverrides.key'] : undefined}
                  />
                </Grid>
                <Grid size={{ xs: 5 }}>
                  <NumberField
                    label="Override Value"
                    value={value}
                    onChange={(next) => handleEffectOverrideChange(key, key, next)}
                    step={0.01}
                    error={fieldErrors[`pvpMultipliers.effectOverrides.${key}`]}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <IconButton
                    aria-label={`Remove effect override ${key || index + 1}`}
                    onClick={() => handleRemoveEffectOverride(key)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddEffectOverride} size="small">
              Add effect override
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
