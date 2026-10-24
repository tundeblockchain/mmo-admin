import { draftHasInvalidIds } from './catalogIds';
import type {
  CatalogEntityData,
  CatalogType,
  ClassDefinition,
  CombatConstantsData,
  ElementDefinition,
  ResonanceDefinition,
  SkillDefinition,
  StatusDefinition,
} from '../types/catalog';
import { hasErrors, type FieldErrors } from './validation/fieldRules';
import { getCombatConstantsFieldErrors } from './validation/combatValidation';
import {
  getClassFieldErrors,
  getElementFieldErrors,
  getResonanceFieldErrors,
  getStatusFieldErrors,
} from './validation/entityValidation';
import { getSkillFieldErrors } from './validation/skillValidation';

export type { FieldErrors } from './validation/fieldRules';
export { getClassFieldErrors } from './validation/entityValidation';
export { getSkillFieldErrors } from './validation/skillValidation';
export { getStatusFieldErrors, getElementFieldErrors, getResonanceFieldErrors } from './validation/entityValidation';
export { getCombatConstantsFieldErrors } from './validation/combatValidation';

export function getEntityFieldErrors(
  entity: unknown,
  catalogType: CatalogType,
): FieldErrors {
  switch (catalogType) {
    case 'class':
      return getClassFieldErrors(entity as ClassDefinition);
    case 'skill':
      return getSkillFieldErrors(entity as SkillDefinition);
    case 'status':
      return getStatusFieldErrors(entity as StatusDefinition);
    case 'element':
      return getElementFieldErrors(entity as ElementDefinition);
    case 'resonance':
      return getResonanceFieldErrors(entity as ResonanceDefinition);
    case 'combat-constants':
      return getCombatConstantsFieldErrors(entity as CombatConstantsData);
  }
}

export function draftHasFieldErrors(data: CatalogEntityData, catalogType: CatalogType): boolean {
  if (catalogType === 'combat-constants') {
    return hasErrors(getCombatConstantsFieldErrors(data as CombatConstantsData));
  }

  return (data as unknown[]).some((entity) => hasErrors(getEntityFieldErrors(entity, catalogType)));
}

export function draftHasValidationErrors(
  data: CatalogEntityData,
  catalogType: CatalogType,
): boolean {
  return draftHasInvalidIds(data, catalogType) || draftHasFieldErrors(data, catalogType);
}
