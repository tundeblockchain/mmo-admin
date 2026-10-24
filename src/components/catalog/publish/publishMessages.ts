import { AdminForbiddenError, ApiError } from '../../../lib/errors';

export const ADMIN_FORBIDDEN_PUBLISH_MESSAGE =
  "Your account isn't an admin, so it can't publish catalogs.";

export const BAD_REQUEST_PUBLISH_MESSAGE =
  'The server rejected this catalog. An empty data array cannot be published.';

export function publishFailureMessage(
  error: Error,
  isConflictError: boolean,
  isAuthError: boolean,
  isForbiddenError: boolean,
  isBadRequestError: boolean,
): string {
  if (isConflictError) {
    return 'Version conflict: Another version was published while you were editing. Please retry to publish as the next version.';
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
