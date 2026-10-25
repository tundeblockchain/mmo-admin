import { useCallback, useState } from 'react';
import {
  addEntryHasErrors,
  buildAddEntry,
  initialAddEntryValues,
  validateAddEntryValues,
  type AddEntryEntity,
  type AddEntryValue,
  type AddEntryValues,
} from '../lib/addEntry';
import type { CatalogType } from '../types/catalog';

interface UseAddEntryFormResult {
  values: AddEntryValues;
  setField: (key: string, value: AddEntryValue) => void;
  errors: ReturnType<typeof validateAddEntryValues>;
  canSubmit: boolean;
  submit: () => AddEntryEntity | null;
}

export function useAddEntryForm(
  catalogType: CatalogType,
  existingIds: string[],
): UseAddEntryFormResult {
  const [values, setValues] = useState<AddEntryValues>(() => initialAddEntryValues(catalogType));
  const errors = validateAddEntryValues(catalogType, values, existingIds);
  const canSubmit = !addEntryHasErrors(catalogType, values, existingIds);

  const setField = useCallback((key: string, value: AddEntryValue) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const submit = useCallback((): AddEntryEntity | null => {
    if (addEntryHasErrors(catalogType, values, existingIds)) {
      return null;
    }
    return buildAddEntry(catalogType, values) as AddEntryEntity;
  }, [catalogType, existingIds, values]);

  return { values, setField, errors, canSubmit, submit };
}
