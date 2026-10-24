import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ResonanceDefinition } from '../../types/catalog';
import { DraftListToolbar } from './DraftListToolbar';

interface ResonanceListProps {
  resonances: ResonanceDefinition[] | undefined;
  selectedResonanceId: string | null;
  selectedIndex?: number | null;
  onSelectResonance: (resonanceId: string, index: number) => void;
  isLoading: boolean;
  error: Error | null;
  isDraft?: boolean;
  onAdd?: () => void;
  onRequestDelete?: (resonanceId: string, index: number, displayName: string) => void;
}

export function ResonanceList({
  resonances,
  selectedResonanceId,
  selectedIndex = null,
  onSelectResonance,
  isLoading,
  error,
  isDraft = false,
  onAdd,
  onRequestDelete,
}: ResonanceListProps) {
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
        Failed to load resonances: {error.message}
      </Alert>
    );
  }

  if (!resonances || resonances.length === 0) {
    return (
      <Box>
        {isDraft && onAdd && <DraftListToolbar label="Resonance" onAdd={onAdd} />}
        <Alert severity="info">
          No resonances found in this version.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {isDraft && onAdd && <DraftListToolbar label="Resonance" onAdd={onAdd} />}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {resonances.map((resonance, index) => (
          <ListItem
            key={`${resonance.resonanceId}-${index}`}
            disablePadding
            secondaryAction={
              onRequestDelete ? (
                <IconButton
                  edge="end"
                  aria-label={`Delete ${resonance.displayName || resonance.resonanceId || 'resonance'}`}
                  onClick={() =>
                    onRequestDelete(resonance.resonanceId, index, resonance.displayName)
                  }
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
                  : selectedResonanceId === resonance.resonanceId
              }
              onClick={() => onSelectResonance(resonance.resonanceId, index)}
            >
              <ListItemText
                primary={resonance.displayName || 'Untitled resonance'}
                secondary={`${resonance.partyBonus.length} bonus${resonance.partyBonus.length !== 1 ? 'es' : ''}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
