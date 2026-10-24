import { Grid } from '@mui/material';
import type { FieldErrors } from '../../../lib/catalogValidation';
import type { CombatConstantsData } from '../../../types/catalog';
import { EditorAccordion, NumberField, PercentField } from '../../form';

interface CriticalDefenseSectionProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors: FieldErrors;
}

export function CriticalSection({ data, onUpdate, fieldErrors }: CriticalDefenseSectionProps) {
  const updateCritical = (field: string, value: number) => {
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
  };

  return (
    <EditorAccordion title="Critical">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Base Crit Chance"
            value={data.critical.baseCritChance}
            onChange={(value) => updateCritical('baseCritChance', value)}
            error={fieldErrors['critical.baseCritChance']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Critical Damage Multiplier"
            value={data.critical.criticalDamageMultiplier}
            onChange={(value) => updateCritical('criticalDamageMultiplier', value)}
            error={fieldErrors['critical.criticalDamageMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Max Luck Crit Bonus"
            value={data.critical.critChance.maxLuckCritBonus}
            onChange={(value) => updateCritical('maxLuckCritBonus', value)}
            error={fieldErrors['critical.critChance.maxLuckCritBonus']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Luck Constant"
            value={data.critical.critChance.luckConstant}
            onChange={(value) => updateCritical('luckConstant', value)}
            error={fieldErrors['critical.critChance.luckConstant']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Proc Luck Divisor"
            value={data.critical.procChance.luckDivisor}
            onChange={(value) => updateCritical('luckDivisor', value)}
            error={fieldErrors['critical.procChance.luckDivisor']}
          />
        </Grid>
      </Grid>
    </EditorAccordion>
  );
}

export function DefenseSection({ data, onUpdate, fieldErrors }: CriticalDefenseSectionProps) {
  const updateDefense = (field: string, value: number) => {
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
  };

  return (
    <EditorAccordion title="Defense">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Defense Base Constant"
            value={data.defense.defenseConstant.baseConstant}
            onChange={(value) => updateDefense('baseConstant', value)}
            error={fieldErrors['defense.defenseConstant.baseConstant']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Defense Level Multiplier"
            value={data.defense.defenseConstant.levelMultiplier}
            onChange={(value) => updateDefense('levelMultiplier', value)}
            error={fieldErrors['defense.defenseConstant.levelMultiplier']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumberField
            label="Armor Reduction/Point"
            value={data.defense.armorReductionPerPoint}
            onChange={(value) => updateDefense('armorReductionPerPoint', value)}
            step={0.001}
            error={fieldErrors['defense.armorReductionPerPoint']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Max Armor Reduction"
            value={data.defense.maxArmorReduction}
            onChange={(value) => updateDefense('maxArmorReduction', value)}
            error={fieldErrors['defense.maxArmorReduction']}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <PercentField
            label="Block Damage Reduction"
            value={data.defense.blockDamageReduction}
            onChange={(value) => updateDefense('blockDamageReduction', value)}
            error={fieldErrors['defense.blockDamageReduction']}
          />
        </Grid>
      </Grid>
    </EditorAccordion>
  );
}
