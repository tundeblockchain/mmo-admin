import type {
  CatalogEntityData,
  CatalogType,
  ClassDefinition,
  CombatConstantsData,
  ElementDefinition,
  ResonanceDefinition,
  SkillDefinition,
  StatusDefinition,
} from '../../types/catalog';

export interface FieldError {
  path: string;
  message: string;
}

export interface CatalogBundle {
  versionTag?: string;
  class?: ClassDefinition[];
  skill?: SkillDefinition[];
  status?: StatusDefinition[];
  element?: ElementDefinition[];
  resonance?: ResonanceDefinition[];
  'combat-constants'?: CombatConstantsData;
}

export type BundleParseResult =
  | { ok: true; bundle: CatalogBundle }
  | { ok: false; errors: FieldError[] };

export type PublishTypeStatus = 'published' | 'skipped' | 'failed';

export interface PublishTypeResult {
  catalogType: CatalogType;
  status: PublishTypeStatus;
  version?: number;
  message?: string;
}

export interface PublishableDraft {
  catalogType: CatalogType;
  data: CatalogEntityData;
  releaseNotes?: string;
}

export const BUNDLE_LIST_TYPES = [
  'class',
  'skill',
  'status',
  'element',
  'resonance',
] as const satisfies readonly CatalogType[];
