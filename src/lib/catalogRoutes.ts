import type { CatalogType } from '../types/catalog';

export interface CatalogSection {
  type: CatalogType;
  slug: string;
  label: string;
}

export const CATALOG_SECTIONS: readonly CatalogSection[] = [
  { type: 'class', slug: 'classes', label: 'Classes' },
  { type: 'skill', slug: 'skills', label: 'Skills' },
  { type: 'combat-constants', slug: 'combat-constants', label: 'Combat Constants' },
  { type: 'status', slug: 'statuses', label: 'Statuses' },
  { type: 'element', slug: 'elements', label: 'Elements' },
  { type: 'resonance', slug: 'resonance', label: 'Resonance' },
];

export const CATALOG_INDEX_PATH = '/catalog';
export const CATALOG_DEFAULT_PATH = '/catalog/classes';

export function catalogPath(slug: string): string {
  return `/catalog/${slug}`;
}

export function catalogTypeFromSection(section: string | undefined): CatalogType | null {
  if (section === undefined) {
    return null;
  }
  return CATALOG_SECTIONS.find((item) => item.slug === section)?.type ?? null;
}

export function catalogPathForType(type: CatalogType): string {
  const section = CATALOG_SECTIONS.find((item) => item.type === type);
  return section ? catalogPath(section.slug) : CATALOG_DEFAULT_PATH;
}

export function isUnknownCatalogSection(section: string | undefined): boolean {
  return section !== undefined && catalogTypeFromSection(section) === null;
}
