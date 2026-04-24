import { STORAGE_KEYS } from '../constants/storage';

export function readAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function clearSessionStorage() {
  localStorage.removeItem(STORAGE_KEYS.token);
}
