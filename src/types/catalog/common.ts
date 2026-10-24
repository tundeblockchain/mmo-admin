export type CatalogType =
  | 'class'
  | 'skill'
  | 'combat-constants'
  | 'status'
  | 'element'
  | 'resonance';

export interface CatalogVersionSummary {
  catalogType: CatalogType;
  version: number;
  status: 'published';
  publishedAt: string;
}

export interface CatalogVersionList {
  versions: CatalogVersionSummary[];
}

export interface LatestVersions {
  versions: Record<CatalogType, number>;
  timestamp: string;
}

export interface CatalogData<T> {
  catalogType: CatalogType;
  version: number;
  status: 'published';
  createdAt: string;
  publishedAt?: string;
  createdBy: string;
  releaseNotes?: string;
  data: T;
}
