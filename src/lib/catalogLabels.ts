import type { CatalogType } from '../types/catalog';

export function formatCatalogType(type: CatalogType): string {
  switch (type) {
    case 'combat-constants':
      return 'Combat Constants';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export function entityKindLabel(type: CatalogType): string {
  switch (type) {
    case 'class':
      return 'class';
    case 'skill':
      return 'skill';
    case 'status':
      return 'status';
    case 'element':
      return 'element';
    case 'resonance':
      return 'resonance';
    case 'combat-constants':
      return 'combat constants';
  }
}
