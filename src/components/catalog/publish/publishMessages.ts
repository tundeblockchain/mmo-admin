import { AdminForbiddenError, ApiError } from '../../../lib/errors';

export const ADMIN_FORBIDDEN_PUBLISH_MESSAGE =
  "Your account isn't an admin, so it can't publish catalogs.";

export const BAD_REQUEST_PUBLISH_MESSAGE =
  'The server rejected this catalog. An empty data array cannot be published.';

export function publishSourceMessage(sourceVersion: number): string {
  if (sourceVersion > 0) {
    return `Publishing will create a new immutable version based on your draft changes from version ${sourceVersion}.`;
  }
  return 'Publishing will create version 1 of this catalog.';
}

export function publishFailureMessage(
  error: Error,
  isConflictError: boolean,
  isAuthError: boolean,
  isForbiddenError: boolean,
  isBadRequestError: boolean,
): string {
  if (isConflictError) {
    return 'This version already exists. Published versions were refreshed. Retry to publish as the next version.';
  }

  if (isAuthError) {
    return 'Authentication required. Please sign in to publish.';
  }

  if (isForbiddenError || error instanceof AdminForbiddenError) {
    return ADMIN_FORBIDDEN_PUBLISH_MESSAGE;
  }

  if (isBadRequestError || (error instanceof ApiError && error.status === 400)) {
    return BAD_REQUEST_PUBLISH_MESSAGE;
  }

  return error.message;
}
