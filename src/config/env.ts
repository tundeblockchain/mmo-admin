interface EnvConfig {
  readonly apiBaseUrl: string;
  readonly firebaseApiKey: string;
  readonly firebaseAuthDomain: string;
  readonly firebaseProjectId: string;
  readonly firebaseStorageBucket: string;
  readonly firebaseMessagingSenderId: string;
  readonly firebaseAppId: string;
}

function getEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name] as string | undefined;
  if (value !== undefined && value !== '') {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`Missing required environment variable: ${name}`);
}

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', ''),
  firebaseApiKey: getEnvVar('VITE_FIREBASE_API_KEY', ''),
  firebaseAuthDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', ''),
  firebaseProjectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', ''),
  firebaseStorageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', ''),
  firebaseMessagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', ''),
  firebaseAppId: getEnvVar('VITE_FIREBASE_APP_ID', ''),
};
