import type { CatalogData } from './common';
import type { ResonanceId } from './class';

export interface ResonancePartyBonus {
  stat: string;
  bonusPercent: number;
}

export interface ResonanceDefinition {
  resonanceId: ResonanceId;
  displayName: string;
  description: string;
  partyBonus: ResonancePartyBonus[];
}

export type ResonanceCatalogData = CatalogData<ResonanceDefinition[]>;
