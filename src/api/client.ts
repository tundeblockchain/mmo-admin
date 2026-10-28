import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getIdToken } from '../auth';
import { env } from '../config/env';
import {
  ADMIN_ACCESS_REQUIRED_MESSAGE,
  AdminForbiddenError,
  ApiError,
} from '../lib/errors';

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

let inFlightForcedRefresh: Promise<string | null> | null = null;

function refreshIdTokenShared(): Promise<string | null> {
  if (!inFlightForcedRefresh) {
    inFlightForcedRefresh = getIdToken(true).finally(() => {
      inFlightForcedRefresh = null;
    });
  }

  return inFlightForcedRefresh;
}

function toApiError(error: AxiosError<{ error?: string }>): AdminForbiddenError | ApiError {
  const status = error.response?.status ?? 0;
  const message = error.response?.data?.error ?? error.message ?? 'Network error';

  if (status === 403) {
    return new AdminForbiddenError(
      ADMIN_ACCESS_REQUIRED_MESSAGE,
      error.response?.data,
    );
  }

  return new ApiError(message, status, error.response?.data);
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (config._authRetry) {
    return config;
  }

  const token = await getIdToken();
  applyAuthorizationHeader(config, token);
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ error?: string }>) => {
    const originalRequest = error.config;
    const status = error.response?.status ?? 0;

    if (status === 403) {
      throw toApiError(error);
    }

    if (status === 401 && originalRequest && !originalRequest._authRetry) {
      originalRequest._authRetry = true;

      try {
        const refreshedToken = await refreshIdTokenShared();
        if (refreshedToken) {
          applyAuthorizationHeader(originalRequest, refreshedToken);
          return apiClient.request(originalRequest);
        }
      } catch {
        // Surface the original 401 through existing error handling.
      }
    }

    throw toApiError(error);
  },
);
