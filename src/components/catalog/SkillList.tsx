import { Box, Chip, Typography } from '@mui/material';
import type { SkillDefinition } from '../../types/catalog';
import { CatalogEntityList } from './CatalogEntityList';

interface SkillListProps {
  skills: SkillDefinition[] | undefined;
  selectedSkillId: string | null;
  selectedIndex?: number | null;
  onSelectSkill: (skillId: string, index: number) => void;
  isLoading: boolean;
  error: Error | null;
  isDraft?: boolean;
  onAdd?: () => void;
  onRequestDelete?: (skillId: string, index: number, displayName: string) => void;
}

export function SkillList({
  skills,
  selectedSkillId,
  selectedIndex = null,
  onSelectSkill,
  isLoading,
  error,
  isDraft = false,
  onAdd,
  onRequestDelete,
}: SkillListProps) {
  return (
    <CatalogEntityList
      items={skills}
      selectedId={selectedSkillId}
      selectedIndex={selectedIndex}
      getId={(item) => item.skillId}
      getDisplayName={(item) => item.displayName}
      untitledLabel="skill"
      entityLabel="Skill"
      emptyNoun="skills"
      onSelect={onSelectSkill}
      isLoading={isLoading}
      error={error}
      isDraft={isDraft}
      onAdd={onAdd}
      onRequestDelete={onRequestDelete}
      groupBy={(skill) => skill.classId || 'unassigned'}
      renderSecondary={(skill) => (
        <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <Chip label={skill.kind} size="small" variant="outlined" />
          {skill.coefficients.element && (
            <Chip label={skill.coefficients.element} size="small" variant="outlined" />
          )}
        </Box>
      )}
      renderMeta={(skill) => (
        <Typography variant="caption" color="text.secondary">
          Lvl {skill.unlockLevel}
        </Typography>
      )}
    />
  );
}
