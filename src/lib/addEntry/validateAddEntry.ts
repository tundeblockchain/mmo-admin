import { getEntityId, getIdValidationMessage } from '../catalogIds';
import { HEX_COLOR_ERROR, HEX_COLOR_PATTERN, REQUIRED_ERROR } from '../catalogSchema';
import { getEntityFieldErrors } from '../catalogValidation';
import { hasErrors, type FieldErrors } from '../validation/fieldRules';
import { getAddEntryConfig, getAddEntryIdField } from './addEntryConfig';
import { buildAddEntry } from './buildAddEntry';
import type { AddEntryValues } from './types';
import type { CatalogType } from '../../types/catalog';

export function validateAddEntryValues(
  catalogType: CatalogType,
  values: AddEntryValues,
  existingIds: string[],
): FieldErrors {
  const entity = buildAddEntry(catalogType, values);
  const errors: FieldErrors = { ...getEntityFieldErrors(entity, catalogType) };
  const config = getAddEntryConfig(catalogType);

  for (const field of config.fields) {
    if (!field.required) {
      continue;
    }
    const value = values[field.key];
    if (typeof value === 'string' && value.trim() === '') {
      errors[field.key] = REQUIRED_ERROR;
    }
  }

  const idField = getAddEntryIdField(catalogType);
  if (idField) {
    const id = getEntityId(entity, catalogType);
    const idError = getIdValidationMessage(id, [...existingIds, id]);
    if (idError) {
      errors[idField.key] = idError;
    }
  }

  const color = values.color;
  if (typeof color === 'string' && color.trim() !== '' && !HEX_COLOR_PATTERN.test(color)) {
    errors.color = HEX_COLOR_ERROR;
  }

  return errors;
}

export function addEntryHasErrors(
  catalogType: CatalogType,
  values: AddEntryValues,
  existingIds: string[],
): boolean {
  return hasErrors(validateAddEntryValues(catalogType, values, existingIds));
}
