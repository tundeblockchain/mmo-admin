import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { SkillDefinition } from '../../types/catalog';
import { DraftListToolbar } from './DraftListToolbar';

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
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load skills: {error.message}
      </Alert>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <Box>
        {isDraft && onAdd && <DraftListToolbar label="Skill" onAdd={onAdd} />}
        <Alert severity="info">
          No skills found in this version.
        </Alert>
      </Box>
    );
  }

  const skillsByClass = skills.reduce<Record<string, Array<{ skill: SkillDefinition; index: number }>>>(
    (acc, skill, index) => {
      const classId = skill.classId || 'unassigned';
      if (!acc[classId]) {
        acc[classId] = [];
      }
      acc[classId].push({ skill, index });
      return acc;
    },
    {},
  );

  return (
    <Box>
      {isDraft && onAdd && <DraftListToolbar label="Skill" onAdd={onAdd} />}
      {Object.entries(skillsByClass).map(([classId, classSkills]) => (
        <Box key={classId} sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              px: 2,
              py: 1,
              bgcolor: 'grey.100',
              textTransform: 'capitalize',
            }}
          >
            {classId}
          </Typography>
          <List disablePadding>
            {classSkills.map(({ skill, index }) => (
              <ListItem
                key={`${skill.skillId}-${index}`}
                disablePadding
                secondaryAction={
                  onRequestDelete ? (
                    <IconButton
                      edge="end"
                      aria-label={`Delete ${skill.displayName || skill.skillId || 'skill'}`}
                      onClick={() => onRequestDelete(skill.skillId, index, skill.displayName)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : undefined
                }
              >
                <ListItemButton
                  selected={
                    selectedIndex !== null
                      ? selectedIndex === index
                      : selectedSkillId === skill.skillId
                  }
                  onClick={() => onSelectSkill(skill.skillId, index)}
                >
                  <ListItemText
                    primary={skill.displayName || 'Untitled skill'}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <Chip label={skill.kind} size="small" variant="outlined" />
                        {skill.coefficients.element && (
                          <Chip
                            label={skill.coefficients.element}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    Lvl {skill.unlockLevel}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}
