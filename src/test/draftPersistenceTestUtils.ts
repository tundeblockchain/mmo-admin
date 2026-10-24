import { writePersistedDraft } from '../lib/draftPersistence';
import { mockClassCatalog } from './mocks/catalog-fixtures';

export function seedClassDraft(sourceVersion: number, displayName = 'Persisted Vanguard') {
  writePersistedDraft({
    catalogType: 'class',
    sourceVersion,
    isDirty: true,
    data: mockClassCatalog.data.map((item) =>
      item.classId === 'vanguard' ? { ...item, displayName } : item,
    ),
  });
}
