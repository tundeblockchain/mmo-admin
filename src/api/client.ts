import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getIdToken } from '../auth';
import { env } from '../config/env';
import { ApiError } from '../lib/errors';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _authRetry?: boolean;
  }
}

function applyAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string | null,
): void {
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
    return;
  }

  config.headers.delete('Authorization');
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  applyAuthorizationHeader(config, token);
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ error?: string }>) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._authRetry
    ) {
      originalRequest._authRetry = true;

      try {
        const refreshedToken = await getIdToken(true);
        if (refreshedToken) {
          return apiClient.request(originalRequest);
        }
      } catch {
        // Surface the original 401 through existing error handling.
      }
    }

    const status = error.response?.status ?? 0;
    const message = error.response?.data?.error ?? error.message ?? 'Network error';
    throw new ApiError(message, status, error.response?.data);
  },
);
