export const ADMIN_ACCESS_REQUIRED_MESSAGE = 'Admin access required.';

export class ApiError extends Error {
  readonly status: number;
  readonly response?: unknown;

  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

export class AdminForbiddenError extends ApiError {
  constructor(message: string, response?: unknown) {
    super(message, 403, response);
    this.name = 'AdminForbiddenError';
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isAdminForbiddenStatus(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}

export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '';
  if (error instanceof Error) {
    console.error(`${prefix} ${error.name}: ${error.message}`);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}
