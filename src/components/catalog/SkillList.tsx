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
} from '@mui/material';
import type { SkillDefinition } from '../../types/catalog';

interface SkillListProps {
  skills: SkillDefinition[] | undefined;
  selectedSkillId: string | null;
  onSelectSkill: (skillId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function SkillList({
  skills,
  selectedSkillId,
  onSelectSkill,
  isLoading,
  error,
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
      <Alert severity="info">
        No skills found in this version.
      </Alert>
    );
  }

  const skillsByClass = skills.reduce<Record<string, SkillDefinition[]>>((acc, skill) => {
    if (!acc[skill.classId]) {
      acc[skill.classId] = [];
    }
    acc[skill.classId].push(skill);
    return acc;
  }, {});

  return (
    <Box>
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
            {classSkills.map((skill) => (
              <ListItem key={skill.skillId} disablePadding>
                <ListItemButton
                  selected={selectedSkillId === skill.skillId}
                  onClick={() => onSelectSkill(skill.skillId)}
                >
                  <ListItemText
                    primary={skill.displayName}
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
