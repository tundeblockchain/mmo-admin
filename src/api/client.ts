import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { env } from '../config/env';
import { ApiError } from '../lib/errors';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status ?? 0;
    const message = error.response?.data?.error ?? error.message ?? 'Network error';
    throw new ApiError(message, status, error.response?.data);
  },
);
