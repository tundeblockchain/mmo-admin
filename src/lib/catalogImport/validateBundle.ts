import { collectEntityIds, getEntityId, getIdValidationMessage } from '../catalogIds';
import { getCombatConstantsFieldErrors, getEntityFieldErrors } from '../catalogValidation';
import { CATALOG_TYPES } from '../draftKeys';
import type { CatalogEntityData, CatalogType, CombatConstantsData } from '../../types/catalog';
import { parseCatalogBundle, parseCatalogJson } from './parseBundle';
import { collectCrossRefErrors } from './validateCrossRefs';
import type { BundleParseResult, CatalogBundle, FieldError } from './types';

export function validateCatalogBundle(value: unknown): BundleParseResult {
  const parsed = parseCatalogBundle(value);
  if (!parsed.ok) {
    return parsed;
  }
  return attachSemanticErrors(parsed.bundle);
}

export function validateCatalogJson(raw: string): BundleParseResult {
  const parsed = parseCatalogJson(raw);
  if (!parsed.ok) {
    return parsed;
  }
  return attachSemanticErrors(parsed.bundle);
}

function attachSemanticErrors(bundle: CatalogBundle): BundleParseResult {
  const errors: FieldError[] = [...collectFieldErrors(bundle), ...collectCrossRefErrors(bundle)];
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, bundle };
}

function collectFieldErrors(bundle: CatalogBundle): FieldError[] {
  const errors: FieldError[] = [];
  for (const catalogType of CATALOG_TYPES) {
    const data = bundle[catalogType];
    if (data === undefined) {
      continue;
    }
    errors.push(...fieldErrorsForType(data, catalogType));
  }
  return errors;
}

function fieldErrorsForType(data: CatalogEntityData, catalogType: CatalogType): FieldError[] {
  if (catalogType === 'combat-constants') {
    return Object.entries(getCombatConstantsFieldErrors(data as CombatConstantsData)).map(
      ([path, message]) => ({ path: `combat-constants.${path}`, message }),
    );
  }

  const items = data as unknown[];
  const ids = collectEntityIds(data, catalogType);
  const errors: FieldError[] = [];
  items.forEach((entity, index) => {
    const idMessage = getIdValidationMessage(getEntityId(entity, catalogType), ids);
    if (idMessage) {
      errors.push({ path: `${catalogType}.${index}`, message: idMessage });
    }
    Object.entries(getEntityFieldErrors(entity, catalogType)).forEach(([path, message]) => {
      errors.push({ path: `${catalogType}.${index}.${path}`, message });
    });
  });
  return errors;
}
