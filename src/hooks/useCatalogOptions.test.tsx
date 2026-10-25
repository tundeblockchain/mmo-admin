import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createDraft } from './useDraftCatalog';
import { useCatalogOptions } from './useCatalogOptions';
import { mockEmptyCatalogApi } from '../test/emptyCatalogTestUtils';
import { mockClassCatalog } from '../test/mocks/catalog-fixtures';

function renderOptionsHook() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return renderHook(() => useCatalogOptions('class'), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe('useCatalogOptions', () => {
  it('returns populated class options from the latest published catalog', async () => {
    const { result } = renderOptionsHook();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isEmpty).toBe(false);
    expect(result.current.options).toEqual([
      { id: 'vanguard', label: 'Vanguard' },
      { id: 'ranger', label: 'Ranger' },
    ]);
  });

  it('merges local draft classes with the latest published version', async () => {
    createDraft('class', 2, [
      { ...mockClassCatalog.data[0], displayName: 'Vanguard Draft' },
      {
        ...mockClassCatalog.data[0],
        classId: 'warden',
        displayName: 'Warden',
      },
    ]);

    const { result } = renderOptionsHook();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.options).toEqual([
      { id: 'vanguard', label: 'Vanguard Draft' },
      { id: 'warden', label: 'Warden' },
      { id: 'ranger', label: 'Ranger' },
    ]);
  });

  it('is empty when no draft or published classes exist', async () => {
    mockEmptyCatalogApi();
    const { result } = renderOptionsHook();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.options).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });
});
