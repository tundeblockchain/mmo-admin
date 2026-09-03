import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { ResonanceDefinition } from '../../types/catalog';

interface ResonanceListProps {
  resonances: ResonanceDefinition[] | undefined;
  selectedResonanceId: string | null;
  onSelectResonance: (resonanceId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function ResonanceList({
  resonances,
  selectedResonanceId,
  onSelectResonance,
  isLoading,
  error,
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
      <Alert severity="info">
        No resonances found in this version.
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {resonances.map((resonance) => (
        <ListItem key={resonance.resonanceId} disablePadding>
          <ListItemButton
            selected={selectedResonanceId === resonance.resonanceId}
            onClick={() => onSelectResonance(resonance.resonanceId)}
          >
            <ListItemText
              primary={resonance.displayName}
              secondary={`${resonance.partyBonus.length} bonus${resonance.partyBonus.length !== 1 ? 'es' : ''}`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
