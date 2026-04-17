import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storage';

type ProcessWithEnv = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const runtimeEnv = globalThis as typeof globalThis & ProcessWithEnv;
const baseURL = runtimeEnv.process?.env?.API_URL ?? 'http://localhost:4000/api';

export const http = axios.create({
  baseURL,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { error?: string } | undefined)?.error ??
      error.message ??
      'Server request failed'
    );
  }
  return 'Unexpected error';
}
