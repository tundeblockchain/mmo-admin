import type { ResonanceDefinition } from '../../types/catalog';
import { CatalogEntityList } from './CatalogEntityList';

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
  return (
    <CatalogEntityList
      items={resonances}
      selectedId={selectedResonanceId}
      selectedIndex={selectedIndex}
      getId={(item) => item.resonanceId}
      getDisplayName={(item) => item.displayName}
      untitledLabel="resonance"
      entityLabel="Resonance"
      emptyNoun="resonances"
      onSelect={onSelectResonance}
      isLoading={isLoading}
      error={error}
      isDraft={isDraft}
      onAdd={onAdd}
      onRequestDelete={onRequestDelete}
      renderSecondary={(resonance) =>
        `${resonance.partyBonus.length} bonus${resonance.partyBonus.length !== 1 ? 'es' : ''}`
      }
    />
  );
}
