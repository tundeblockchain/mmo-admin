export const REAL_AUTH_ENV_NAMES = [
  'E2E_TEST_EMAIL',
  'E2E_TEST_PASSWORD',
  'E2E_FIREBASE_API_KEY',
  'E2E_FIREBASE_AUTH_DOMAIN',
  'E2E_FIREBASE_PROJECT_ID',
  'E2E_FIREBASE_APP_ID',
] as const;

export function missingRealAuthEnvNames(): string[] {
  return REAL_AUTH_ENV_NAMES.filter((name) => {
    const value = process.env[name];
    return value === undefined || value === '';
  });
}

export function realAuthSkipMessage(missing: string[]): string {
  return `Skipping real sign-in: required environment variables are not set (${missing.join(', ')})`;
}
