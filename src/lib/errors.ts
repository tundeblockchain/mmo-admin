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

export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '';
  if (error instanceof Error) {
    console.error(`${prefix} ${error.name}: ${error.message}`);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}
