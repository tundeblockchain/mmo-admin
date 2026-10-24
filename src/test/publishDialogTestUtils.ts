import { vi } from 'vitest';
import { mockClassCatalog } from './mocks/catalog-fixtures';

export const mockClassData = [mockClassCatalog.data[0]];

export function publishDialogDefaultProps() {
  return {
    open: true,
    onClose: vi.fn(),
    onPublish: vi.fn(),
    catalogType: 'class' as const,
    sourceVersion: 1,
    originalData: mockClassData,
    draftData: mockClassData,
    isPending: false,
    error: null,
    isConflictError: false,
    isAuthError: false,
  };
}
