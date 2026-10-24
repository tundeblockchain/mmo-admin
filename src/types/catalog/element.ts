import type { CatalogData } from './common';
import type { ElementId } from './skill';

export interface ElementDefinition {
  elementId: ElementId;
  displayName: string;
  color: string;
  strongAgainst: Record<string, number>;
  weakAgainst: Record<string, number>;
}

export type ElementCatalogData = CatalogData<ElementDefinition[]>;
