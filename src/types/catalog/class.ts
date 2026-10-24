import type { CatalogData } from './common';

export interface PrimaryStats {
  strength: number;
  finesse: number;
  vitality: number;
  intellect: number;
  precision: number;
  luck: number;
  tech: number;
}

export interface ClassStartingStats extends PrimaryStats {
  hp: number;
  resourcePool: number;
  armor: number;
  attackPower: number;
  spellPower: number;
  movementSpeed: number;
}

export type ClassRole = 'tank' | 'healer' | 'dps' | 'support';
export type ClassId = string;
export type PrimaryResource = 'resolve' | 'focus' | 'mana' | 'charge' | 'radiance' | 'momentum';
export type ResonanceId = string;

export interface ClassDefinition {
  classId: ClassId;
  displayName: string;
  description: string;
  primaryResource: PrimaryResource;
  secondaryResource?: string;
  startingStats: ClassStartingStats;
  resonance: ResonanceId;
  roles: ClassRole[];
}

export type ClassCatalogData = CatalogData<ClassDefinition[]>;
