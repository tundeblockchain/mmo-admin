interface EnvConfig {
  readonly apiBaseUrl: string;
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
};
