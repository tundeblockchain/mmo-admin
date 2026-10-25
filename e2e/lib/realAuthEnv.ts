export const REAL_AUTH_ENV_NAMES = [
  'E2E_TEST_EMAIL',
  'E2E_TEST_PASSWORD',
  'E2E_FIREBASE_API_KEY',
  'E2E_FIREBASE_AUTH_DOMAIN',
  'E2E_FIREBASE_PROJECT_ID',
  'E2E_FIREBASE_APP_ID',
] as const;

export type RealAuthEnvName = (typeof REAL_AUTH_ENV_NAMES)[number];

export function readRealAuthEnv(name: RealAuthEnvName): string {
  return (process.env[name] ?? '').trim();
}

export function missingRealAuthEnvNames(): string[] {
  return REAL_AUTH_ENV_NAMES.filter((name) => readRealAuthEnv(name) === '');
}

export function realAuthSkipMessage(missing: string[]): string {
  return `Skipping real sign-in: required environment variables are not set (${missing.join(', ')})`;
}
