export type {
  CatalogType,
  CatalogVersionSummary,
  CatalogVersionList,
  LatestVersions,
  CatalogData,
} from './common';
export type {
  PrimaryStats,
  ClassStartingStats,
  ClassRole,
  ClassId,
  PrimaryResource,
  ResonanceId,
  ClassDefinition,
  ClassCatalogData,
} from './class';
export type {
  ScalingStat,
  ScalingVector,
  ElementId,
  ActivePhaseType,
  SkillCondition,
  PerStackCoefficients,
  SkillConditional,
  SkillCoefficients,
  SkillTiming,
  StaggerCoefficients,
  ResourceEffect,
  PvPMultipliers,
  SkillKind,
  SkillDefinition,
  SkillCatalogData,
} from './skill';
export type { StatusCategory, StatusDefinition, StatusCatalogData } from './status';
export type { ElementDefinition, ElementCatalogData } from './element';
export type {
  ResonancePartyBonus,
  ResonanceDefinition,
  ResonanceCatalogData,
} from './resonance';
export type {
  PowerScalingConstants,
  CombatConstantsData,
  CombatConstantsCatalogData,
} from './combat';

import type { ClassCatalogData, ClassDefinition } from './class';
import type { SkillCatalogData, SkillDefinition } from './skill';
import type { StatusCatalogData, StatusDefinition } from './status';
import type { ElementCatalogData, ElementDefinition } from './element';
import type { ResonanceCatalogData, ResonanceDefinition } from './resonance';
import type { CombatConstantsCatalogData, CombatConstantsData } from './combat';
import type { CatalogType } from './common';

export type AnyCatalogData =
  | ClassCatalogData
  | SkillCatalogData
  | StatusCatalogData
  | ElementCatalogData
  | ResonanceCatalogData
  | CombatConstantsCatalogData;

export type CatalogEntityData =
  | ClassDefinition[]
  | SkillDefinition[]
  | StatusDefinition[]
  | ElementDefinition[]
  | ResonanceDefinition[]
  | CombatConstantsData;

export interface PublishCatalogRequest {
  data: CatalogEntityData;
  releaseNotes?: string;
}

export interface PublishedCatalogResponse {
  catalogType: CatalogType;
  version: number;
  status: 'published';
  createdAt: string;
  publishedAt: string;
  createdBy: string;
  releaseNotes?: string;
}
