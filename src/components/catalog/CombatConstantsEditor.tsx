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
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  type SelectChangeEvent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldErrors } from '../../lib/catalogValidation';
import {
  NumberField,
  OptionalNumberField,
  OptionalPercentField,
  PercentField,
} from './catalogFields';
import type { CombatConstantsData, PowerScalingConstants } from '../../types/catalog';

interface CombatConstantsEditorProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors?: FieldErrors;
}

type AdditionalConstantType = 'number' | 'boolean' | 'string';

function additionalConstantType(value: number | boolean | string): AdditionalConstantType {
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  return 'string';
}

function parseAdditionalConstant(
  raw: string,
  valueType: AdditionalConstantType,
): number | boolean | string {
  if (valueType === 'boolean') {
    return raw === 'true';
  }
  if (valueType === 'number') {
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return raw;
}

export function CombatConstantsEditor({
  data,
  onUpdate,
  fieldErrors = {},
}: CombatConstantsEditorProps) {
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

  const handleNestedNumberChange = useCallback(
    (updater: (current: CombatConstantsData) => CombatConstantsData) => {
      onUpdate(updater(data));
    },
    [data, onUpdate],
  );

  const handlePvpChange = useCallback(
    (field: 'globalDamageMultiplier' | 'globalHealingMultiplier' | 'ccDurationMultiplier' | 'executeThresholdModifier', value: number | undefined) => {
      onUpdate({
        ...data,
        pvp: { ...data.pvp, [field]: value },
      });
    },
    [data, onUpdate],
  );

  const handleAddBand = useCallback(() => {
    onUpdate({
      ...data,
      statAllocationBands: [
        ...(data.statAllocationBands ?? []),
        { minLevel: 1, maxLevel: 10, pointsPerLevel: 1, allocationCostPerPoint: 1 },
      ],
    });
  }, [data, onUpdate]);

  const handleBandChange = useCallback(
    (index: number, field: 'minLevel' | 'maxLevel' | 'pointsPerLevel' | 'allocationCostPerPoint', value: number) => {
      const statAllocationBands = [...(data.statAllocationBands ?? [])];
      statAllocationBands[index] = { ...statAllocationBands[index], [field]: value };
      onUpdate({ ...data, statAllocationBands });
    },
    [data, onUpdate],
  );

  const handleRemoveBand = useCallback(
    (index: number) => {
      const statAllocationBands = (data.statAllocationBands ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      );
      onUpdate({
        ...data,
        statAllocationBands: statAllocationBands.length === 0 ? undefined : statAllocationBands,
      });
    },
    [data, onUpdate],
  );

  const handleAddConstant = useCallback(() => {
    onUpdate({
      ...data,
      additionalConstants: { ...data.additionalConstants, '': 0 },
    });
  }, [data, onUpdate]);

  const handleConstantKeyChange = useCallback(
    (oldKey: string, nextKey: string, value: number | boolean | string) => {
      const additionalConstants = { ...data.additionalConstants };
      delete additionalConstants[oldKey];
      additionalConstants[nextKey] = value;
      onUpdate({ ...data, additionalConstants });
    },
    [data, onUpdate],
  );

  const handleConstantValueChange = useCallback(
    (key: string, value: number | boolean | string) => {
      onUpdate({
        ...data,
        additionalConstants: { ...data.additionalConstants, [key]: value },
      });
    },
    [data, onUpdate],
  );

  const handleConstantTypeChange = useCallback(
    (key: string, nextType: AdditionalConstantType, current: number | boolean | string) => {
      let next: number | boolean | string = 0;
      if (nextType === 'boolean') {
        next = Boolean(current);
      } else if (nextType === 'string') {
        next = String(current);
      } else if (typeof current === 'number') {
        next = current;
      }
      onUpdate({
        ...data,
        additionalConstants: { ...data.additionalConstants, [key]: next },
      });
    },
    [data, onUpdate],
  );

  const handleRemoveConstant = useCallback(
    (key: string) => {
      const additionalConstants = { ...data.additionalConstants };
      delete additionalConstants[key];
      onUpdate({
        ...data,
        additionalConstants:
          Object.keys(additionalConstants).length === 0 ? undefined : additionalConstants,
      });
    },
    [data, onUpdate],
  );

  const additionalConstants = Object.entries(data.additionalConstants ?? {});

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
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    physicalPower: { ...data.powerScaling.physicalPower, strengthMultiplier: value },
                  })
                }
                step={0.1}
                error={fieldErrors['powerScaling.physicalPower.strengthMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Level Multiplier"
                value={data.powerScaling.physicalPower.levelMultiplier}
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    physicalPower: { ...data.powerScaling.physicalPower, levelMultiplier: value },
                  })
                }
                step={0.1}
                error={fieldErrors['powerScaling.physicalPower.levelMultiplier']}
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
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    spellPower: { ...data.powerScaling.spellPower, intellectMultiplier: value },
                  })
                }
                step={0.1}
                error={fieldErrors['powerScaling.spellPower.intellectMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Level Multiplier"
                value={data.powerScaling.spellPower.levelMultiplier}
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    spellPower: { ...data.powerScaling.spellPower, levelMultiplier: value },
                  })
                }
                step={0.1}
                error={fieldErrors['powerScaling.spellPower.levelMultiplier']}
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
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    techPower: { ...data.powerScaling.techPower, techMultiplier: value },
                  })
                }
                step={0.1}
                error={fieldErrors['powerScaling.techPower.techMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Level Multiplier"
                value={data.powerScaling.techPower.levelMultiplier}
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    techPower: { ...data.powerScaling.techPower, levelMultiplier: value },
                  })
                }
                step={0.1}
                error={fieldErrors['powerScaling.techPower.levelMultiplier']}
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
                onChange={(value) =>
                  handlePowerScalingChange({
                    ...data.powerScaling,
                    devicePower: { ...data.powerScaling.devicePower, techDivisor: value },
                  })
                }
                error={fieldErrors['powerScaling.devicePower.techDivisor']}
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
                onChange={(value) => handleCriticalChange('baseCritChance', value)}
                error={fieldErrors['critical.baseCritChance']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Critical Damage Multiplier"
                value={data.critical.criticalDamageMultiplier}
                onChange={(value) => handleCriticalChange('criticalDamageMultiplier', value)}
                error={fieldErrors['critical.criticalDamageMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Max Luck Crit Bonus"
                value={data.critical.critChance.maxLuckCritBonus}
                onChange={(value) => handleCriticalChange('maxLuckCritBonus', value)}
                error={fieldErrors['critical.critChance.maxLuckCritBonus']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Luck Constant"
                value={data.critical.critChance.luckConstant}
                onChange={(value) => handleCriticalChange('luckConstant', value)}
                error={fieldErrors['critical.critChance.luckConstant']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Proc Luck Divisor"
                value={data.critical.procChance.luckDivisor}
                onChange={(value) => handleCriticalChange('luckDivisor', value)}
                error={fieldErrors['critical.procChance.luckDivisor']}
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
                onChange={(value) => handleDefenseChange('baseConstant', value)}
                error={fieldErrors['defense.defenseConstant.baseConstant']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Defense Level Multiplier"
                value={data.defense.defenseConstant.levelMultiplier}
                onChange={(value) => handleDefenseChange('levelMultiplier', value)}
                error={fieldErrors['defense.defenseConstant.levelMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <NumberField
                label="Armor Reduction/Point"
                value={data.defense.armorReductionPerPoint}
                onChange={(value) => handleDefenseChange('armorReductionPerPoint', value)}
                step={0.001}
                error={fieldErrors['defense.armorReductionPerPoint']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Max Armor Reduction"
                value={data.defense.maxArmorReduction}
                onChange={(value) => handleDefenseChange('maxArmorReduction', value)}
                error={fieldErrors['defense.maxArmorReduction']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <PercentField
                label="Block Damage Reduction"
                value={data.defense.blockDamageReduction}
                onChange={(value) => handleDefenseChange('blockDamageReduction', value)}
                error={fieldErrors['defense.blockDamageReduction']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Speed</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Attack Speed Finesse Constant"
                value={data.speed?.attackSpeed?.finesseConstant}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    speed: {
                      ...current.speed,
                      attackSpeed: { ...current.speed?.attackSpeed, finesseConstant: value },
                    },
                  }))
                }
                error={fieldErrors['speed.attackSpeed.finesseConstant']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Attack Speed Cap"
                value={data.speed?.attackSpeed?.attackSpeedCap}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    speed: {
                      ...current.speed,
                      attackSpeed: { ...current.speed?.attackSpeed, attackSpeedCap: value },
                    },
                  }))
                }
                step={0.1}
                error={fieldErrors['speed.attackSpeed.attackSpeedCap']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Dodge Recovery Finesse Constant"
                value={data.speed?.dodgeRecovery?.finesseConstant}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    speed: {
                      ...current.speed,
                      dodgeRecovery: { ...current.speed?.dodgeRecovery, finesseConstant: value },
                    },
                  }))
                }
                error={fieldErrors['speed.dodgeRecovery.finesseConstant']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Vitality</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Max HP Vitality Divisor"
                value={data.vitality?.maxHp?.vitalityDivisor}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    vitality: {
                      ...current.vitality,
                      maxHp: { ...current.vitality?.maxHp, vitalityDivisor: value },
                    },
                  }))
                }
                error={fieldErrors['vitality.maxHp.vitalityDivisor']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Healing Received Vitality Divisor"
                value={data.vitality?.healingReceived?.vitalityDivisor}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    vitality: {
                      ...current.vitality,
                      healingReceived: {
                        ...current.vitality?.healingReceived,
                        vitalityDivisor: value,
                      },
                    },
                  }))
                }
                error={fieldErrors['vitality.healingReceived.vitalityDivisor']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Accuracy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Base Hit Chance"
                value={data.accuracy?.baseHitChance}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    accuracy: { ...current.accuracy, baseHitChance: value },
                  }))
                }
                error={fieldErrors['accuracy.baseHitChance']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Precision Constant"
                value={data.accuracy?.accuracyBonus?.precisionConstant}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    accuracy: {
                      ...current.accuracy,
                      accuracyBonus: {
                        ...current.accuracy?.accuracyBonus,
                        precisionConstant: value,
                      },
                    },
                  }))
                }
                error={fieldErrors['accuracy.accuracyBonus.precisionConstant']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Max Accuracy Bonus"
                value={data.accuracy?.accuracyBonus?.maxAccuracyBonus}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    accuracy: {
                      ...current.accuracy,
                      accuracyBonus: {
                        ...current.accuracy?.accuracyBonus,
                        maxAccuracyBonus: value,
                      },
                    },
                  }))
                }
                error={fieldErrors['accuracy.accuracyBonus.maxAccuracyBonus']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Weak Point Precision Multiplier"
                value={data.accuracy?.weakPoint?.precisionMultiplier}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    accuracy: {
                      ...current.accuracy,
                      weakPoint: { ...current.accuracy?.weakPoint, precisionMultiplier: value },
                    },
                  }))
                }
                step={0.0001}
                error={fieldErrors['accuracy.weakPoint.precisionMultiplier']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Glancing Hit</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Damage Multiplier"
                value={data.glancingHit?.damageMultiplier}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    glancingHit: { ...current.glancingHit, damageMultiplier: value },
                  }))
                }
                error={fieldErrors['glancingHit.damageMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.glancingHit?.canCrit ?? false}
                    onChange={(_, checked) =>
                      handleNestedNumberChange((current) => ({
                        ...current,
                        glancingHit: { ...current.glancingHit, canCrit: checked },
                      }))
                    }
                  />
                }
                label="Can Crit"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.glancingHit?.canStagger ?? false}
                    onChange={(_, checked) =>
                      handleNestedNumberChange((current) => ({
                        ...current,
                        glancingHit: { ...current.glancingHit, canStagger: checked },
                      }))
                    }
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
          <Typography variant="h6">Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Resistance Constant"
                value={data.status?.resistanceConstant}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    status: { ...current.status, resistanceConstant: value },
                  }))
                }
                error={fieldErrors['status.resistanceConstant']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Stat Caps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Soft Cap"
                value={data.statCaps?.softCap}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    statCaps: { ...current.statCaps, softCap: value },
                  }))
                }
                error={fieldErrors['statCaps.softCap']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Hard Cap"
                value={data.statCaps?.hardCap}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    statCaps: { ...current.statCaps, hardCap: value },
                  }))
                }
                error={fieldErrors['statCaps.hardCap']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Soft Cap Penalty"
                value={data.statCaps?.softCapPenalty}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    statCaps: { ...current.statCaps, softCapPenalty: value },
                  }))
                }
                error={fieldErrors['statCaps.softCapPenalty']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Dodge</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Base Dodge Chance"
                value={data.dodge?.baseDodgeChance}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    dodge: { ...current.dodge, baseDodgeChance: value },
                  }))
                }
                error={fieldErrors['dodge.baseDodgeChance']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Max Dodge Chance"
                value={data.dodge?.maxDodgeChance}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    dodge: { ...current.dodge, maxDodgeChance: value },
                  }))
                }
                error={fieldErrors['dodge.maxDodgeChance']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Timing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Global Cooldown"
                value={data.timing?.globalCooldown}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    timing: { ...current.timing, globalCooldown: value },
                  }))
                }
                step={0.1}
                error={fieldErrors['timing.globalCooldown']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Out-of-Combat HP Regen"
                value={data.timing?.outOfCombatHpRegen}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    timing: { ...current.timing, outOfCombatHpRegen: value },
                  }))
                }
                error={fieldErrors['timing.outOfCombatHpRegen']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Out-of-Combat Resource Regen"
                value={data.timing?.outOfCombatResourceRegen}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    timing: { ...current.timing, outOfCombatResourceRegen: value },
                  }))
                }
                error={fieldErrors['timing.outOfCombatResourceRegen']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Combat Dropoff (seconds)"
                value={data.timing?.combatDropoffSeconds}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    timing: { ...current.timing, combatDropoffSeconds: value },
                  }))
                }
                error={fieldErrors['timing.combatDropoffSeconds']}
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
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Base Stagger Threshold"
                value={data.stagger?.baseStaggerThreshold}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    stagger: { ...current.stagger, baseStaggerThreshold: value },
                  }))
                }
                error={fieldErrors['stagger.baseStaggerThreshold']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Stagger Recovery Rate"
                value={data.stagger?.staggerRecoveryRate}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    stagger: { ...current.stagger, staggerRecoveryRate: value },
                  }))
                }
                error={fieldErrors['stagger.staggerRecoveryRate']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Stagger Duration (seconds)"
                value={data.stagger?.staggerDurationSeconds}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    stagger: { ...current.stagger, staggerDurationSeconds: value },
                  }))
                }
                error={fieldErrors['stagger.staggerDurationSeconds']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalNumberField
                label="Stagger Immunity (seconds)"
                value={data.stagger?.staggerImmunitySeconds}
                onChange={(value) =>
                  handleNestedNumberChange((current) => ({
                    ...current,
                    stagger: { ...current.stagger, staggerImmunitySeconds: value },
                  }))
                }
                error={fieldErrors['stagger.staggerImmunitySeconds']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">PvP</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Global Damage Multiplier"
                value={data.pvp?.globalDamageMultiplier}
                onChange={(value) => handlePvpChange('globalDamageMultiplier', value)}
                error={fieldErrors['pvp.globalDamageMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Global Healing Multiplier"
                value={data.pvp?.globalHealingMultiplier}
                onChange={(value) => handlePvpChange('globalHealingMultiplier', value)}
                error={fieldErrors['pvp.globalHealingMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="CC Duration Multiplier"
                value={data.pvp?.ccDurationMultiplier}
                onChange={(value) => handlePvpChange('ccDurationMultiplier', value)}
                error={fieldErrors['pvp.ccDurationMultiplier']}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <OptionalPercentField
                label="Execute Threshold Modifier"
                value={data.pvp?.executeThresholdModifier}
                onChange={(value) => handlePvpChange('executeThresholdModifier', value)}
                error={fieldErrors['pvp.executeThresholdModifier']}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Stat Allocation Bands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(data.statAllocationBands ?? []).map((band, index) => (
            <Grid container spacing={2} key={`band-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
              <Grid size={{ xs: 6, md: 2 }}>
                <NumberField
                  label="Min Level"
                  value={band.minLevel}
                  onChange={(value) => handleBandChange(index, 'minLevel', value)}
                  error={fieldErrors[`statAllocationBands.${index}.minLevel`]}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <NumberField
                  label="Max Level"
                  value={band.maxLevel}
                  onChange={(value) => handleBandChange(index, 'maxLevel', value)}
                  error={fieldErrors[`statAllocationBands.${index}.maxLevel`]}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <NumberField
                  label="Points Per Level"
                  value={band.pointsPerLevel}
                  onChange={(value) => handleBandChange(index, 'pointsPerLevel', value)}
                  error={fieldErrors[`statAllocationBands.${index}.pointsPerLevel`]}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <NumberField
                  label="Allocation Cost Per Point"
                  value={band.allocationCostPerPoint}
                  onChange={(value) => handleBandChange(index, 'allocationCostPerPoint', value)}
                  error={fieldErrors[`statAllocationBands.${index}.allocationCostPerPoint`]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <IconButton
                  aria-label={`Remove allocation band ${index + 1}`}
                  onClick={() => handleRemoveBand(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddBand} size="small">
            Add allocation band
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Additional Constants</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {additionalConstants.map(([key, value], index) => {
            const valueType = additionalConstantType(value);
            return (
              <Grid container spacing={2} key={`constant-${index}`} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Key"
                    value={key}
                    onChange={(event) => handleConstantKeyChange(key, event.target.value, value)}
                    size="small"
                    fullWidth
                    error={key.trim() === '' && fieldErrors['additionalConstants.key'] !== undefined}
                    helperText={key.trim() === '' ? fieldErrors['additionalConstants.key'] : undefined}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`constant-type-${index}-label`}>Type</InputLabel>
                    <Select
                      labelId={`constant-type-${index}-label`}
                      value={valueType}
                      label="Type"
                      onChange={(event: SelectChangeEvent<AdditionalConstantType>) =>
                        handleConstantTypeChange(key, event.target.value as AdditionalConstantType, value)
                      }
                    >
                      <MenuItem value="number">number</MenuItem>
                      <MenuItem value="boolean">boolean</MenuItem>
                      <MenuItem value="string">string</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 5, md: 4 }}>
                  {valueType === 'boolean' ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(value)}
                          onChange={(_, checked) => handleConstantValueChange(key, checked)}
                        />
                      }
                      label="Value"
                    />
                  ) : (
                    <TextField
                      label="Value"
                      type={valueType === 'number' ? 'number' : 'text'}
                      value={String(value)}
                      onChange={(event) =>
                        handleConstantValueChange(
                          key,
                          parseAdditionalConstant(event.target.value, valueType),
                        )
                      }
                      size="small"
                      fullWidth
                      error={fieldErrors[`additionalConstants.${key}`] !== undefined}
                      helperText={fieldErrors[`additionalConstants.${key}`]}
                    />
                  )}
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton
                    aria-label={`Remove additional constant ${key || index + 1}`}
                    onClick={() => handleRemoveConstant(key)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
          <Button startIcon={<AddIcon />} onClick={handleAddConstant} size="small">
            Add additional constant
          </Button>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
