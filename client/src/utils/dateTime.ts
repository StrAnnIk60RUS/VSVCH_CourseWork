import { STORAGE_KEYS } from '../constants/storage';

type UiLanguage = 'ru' | 'en';

function getCurrentUiLanguage(): UiLanguage {
  const raw = localStorage.getItem(STORAGE_KEYS.uiLanguage);
  return raw === 'ru' ? 'ru' : 'en';
}

export function getCurrentLocale(): string {
  return getCurrentUiLanguage() === 'ru' ? 'ru-RU' : 'en-US';
}

function toValidDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date, fallback = '—'): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(getCurrentLocale()).format(date);
}

export function formatDateTime(value: string | Date, fallback = '—'): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(getCurrentLocale(), { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function formatShortDay(value: string | Date, fallback = ''): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(getCurrentLocale(), { day: '2-digit', month: '2-digit' }).format(date);
}
