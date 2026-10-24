import type { CatalogData } from './common';

export type StatusCategory = 'buff' | 'debuff' | 'dot' | 'hot' | 'control';

export interface StatusDefinition {
  statusId: string;
  displayName: string;
  description: string;
  category: StatusCategory;
  maxStacks: number;
  dispellable: boolean;
  persistsThroughDeath: boolean;
  iconPath: string;
}

export type StatusCatalogData = CatalogData<StatusDefinition[]>;
