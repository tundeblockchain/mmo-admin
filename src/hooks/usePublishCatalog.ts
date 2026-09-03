import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publishCatalog } from '../api/catalog';
import { queryKeys } from './queryKeys';
import { ApiError } from '../lib/errors';
import type { CatalogType, PublishCatalogRequest, PublishedCatalogResponse } from '../types/catalog';

interface PublishCatalogVariables {
  catalogType: CatalogType;
  request: PublishCatalogRequest;
}

interface UsePublishCatalogResult {
  publish: (variables: PublishCatalogVariables) => Promise<PublishedCatalogResponse>;
  isPending: boolean;
  error: Error | null;
  isConflictError: boolean;
  isAuthError: boolean;
  reset: () => void;
}

export function usePublishCatalog(): UsePublishCatalogResult {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ catalogType, request }: PublishCatalogVariables) =>
      publishCatalog(catalogType, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.catalog.versions() });
    },
  });

  const error = mutation.error;
  const isConflictError = error instanceof ApiError && error.status === 409;
  const isAuthError = error instanceof ApiError && error.status === 401;

  return {
    publish: mutation.mutateAsync,
    isPending: mutation.isPending,
    error,
    isConflictError,
    isAuthError,
    reset: mutation.reset,
  };
}
