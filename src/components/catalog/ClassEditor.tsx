import { useCallback } from 'react';
import { Box, Chip, Divider, Grid, TextField, Typography } from '@mui/material';
import {
  CLASS_ROLES,
  PRIMARY_RESOURCES,
  RESONANCE_IDS,
  SECONDARY_RESOURCES,
} from '../../lib/catalogSchema';
import type { FieldErrors } from '../../lib/catalogValidation';
import type { ClassDefinition, ClassRole, PrimaryResource, ResonanceId } from '../../types/catalog';
import { CatalogEditorLayout, IdentityFields, SelectField } from '../form';

interface ClassEditorProps {
  classData: ClassDefinition;
  onUpdate: (updated: ClassDefinition) => void;
  idError?: string | null;
  fieldErrors?: FieldErrors;
}

const PRIMARY_STATS = [
  { key: 'strength' as const, label: 'Strength' },
  { key: 'finesse' as const, label: 'Finesse' },
  { key: 'vitality' as const, label: 'Vitality' },
  { key: 'intellect' as const, label: 'Intellect' },
  { key: 'precision' as const, label: 'Precision' },
  { key: 'luck' as const, label: 'Luck' },
  { key: 'tech' as const, label: 'Tech' },
];

const DERIVED_STATS = [
  { key: 'hp' as const, label: 'HP' },
  { key: 'resourcePool' as const, label: 'Resource Pool' },
  { key: 'armor' as const, label: 'Armor' },
  { key: 'attackPower' as const, label: 'Attack Power' },
  { key: 'spellPower' as const, label: 'Spell Power' },
  { key: 'movementSpeed' as const, label: 'Movement Speed' },
];

export function ClassEditor({
  classData,
  onUpdate,
  idError = null,
  fieldErrors = {},
}: ClassEditorProps) {
  const handleFieldChange = useCallback(
    (field: keyof ClassDefinition, value: ClassDefinition[keyof ClassDefinition]) => {
      onUpdate({ ...classData, [field]: value });
    },
    [classData, onUpdate],
  );

  const handleRoleToggle = useCallback(
    (role: ClassRole) => {
      const roles = classData.roles.includes(role)
        ? classData.roles.filter((item) => item !== role)
        : [...classData.roles, role];
      onUpdate({ ...classData, roles });
    },
    [classData, onUpdate],
  );

  const handleStatChange = useCallback(
    (statKey: keyof ClassDefinition['startingStats']) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value) || 0;
        onUpdate({
          ...classData,
          startingStats: { ...classData.startingStats, [statKey]: value },
        });
      },
    [classData, onUpdate],
  );

  const secondaryOptions = (
    classData.secondaryResource &&
    !SECONDARY_RESOURCES.includes(
      classData.secondaryResource as (typeof SECONDARY_RESOURCES)[number],
    )
      ? [...SECONDARY_RESOURCES, classData.secondaryResource]
      : SECONDARY_RESOURCES
  ) as readonly string[];

  return (
    <CatalogEditorLayout title="Class Editor">
      <IdentityFields
        idLabel="Class ID"
        idValue={classData.classId}
        onIdChange={(value) => handleFieldChange('classId', value)}
        idError={idError}
        idHelperText="Unique identifier for this class (e.g. vanguard)."
        nameValue={classData.displayName}
        onNameChange={(value) => handleFieldChange('displayName', value)}
        descriptionValue={classData.description}
        onDescriptionChange={(value) => handleFieldChange('description', value)}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SelectField
              label="Primary Resource"
              labelId="class-primary-resource-label"
              value={classData.primaryResource}
              onChange={(value) => handleFieldChange('primaryResource', value as PrimaryResource)}
              options={PRIMARY_RESOURCES}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SelectField
              label="Secondary Resource"
              labelId="class-secondary-resource-label"
              value={classData.secondaryResource ?? ''}
              onChange={(value) =>
                handleFieldChange('secondaryResource', value === '' ? undefined : value)
              }
              options={secondaryOptions}
              includeEmpty
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SelectField
              label="Resonance"
              labelId="class-resonance-label"
              value={classData.resonance}
              onChange={(value) => handleFieldChange('resonance', value as ResonanceId)}
              options={RESONANCE_IDS}
            />
          </Grid>
        </Grid>
      </IdentityFields>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Roles
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {CLASS_ROLES.map((role) => (
            <Chip
              key={role}
              label={role}
              onClick={() => handleRoleToggle(role)}
              color={classData.roles.includes(role) ? 'primary' : 'default'}
              variant={classData.roles.includes(role) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Starting Stats
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            Primary Stats
          </Typography>
          <Grid container spacing={1}>
            {PRIMARY_STATS.map((stat) => (
              <Grid size={6} key={stat.key}>
                <TextField
                  label={stat.label}
                  type="number"
                  value={classData.startingStats[stat.key]}
                  onChange={handleStatChange(stat.key)}
                  size="small"
                  fullWidth
                  slotProps={{ htmlInput: { step: 1 } }}
                  error={fieldErrors[`startingStats.${stat.key}`] !== undefined}
                  helperText={fieldErrors[`startingStats.${stat.key}`]}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            Derived Stats
          </Typography>
          <Grid container spacing={1}>
            {DERIVED_STATS.map((stat) => (
              <Grid size={6} key={stat.key}>
                <TextField
                  label={stat.label}
                  type="number"
                  value={classData.startingStats[stat.key]}
                  onChange={handleStatChange(stat.key)}
                  size="small"
                  fullWidth
                  slotProps={{ htmlInput: { step: stat.key === 'movementSpeed' ? 0.1 : 1 } }}
                  error={fieldErrors[`startingStats.${stat.key}`] !== undefined}
                  helperText={fieldErrors[`startingStats.${stat.key}`]}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </CatalogEditorLayout>
  );
}
