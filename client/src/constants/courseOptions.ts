export const COURSE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'pl', label: 'Polish' },
] as const;

export type CourseLanguageCode = (typeof COURSE_LANGUAGES)[number]['code'];

/** @deprecated Use COURSE_LANGUAGES labels; kept for backward compatibility */
export const COURSE_LANGUAGE_OPTIONS = COURSE_LANGUAGES.map((item) => item.label);

export const COURSE_LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const LABEL_BY_CODE = Object.fromEntries(COURSE_LANGUAGES.map((item) => [item.code, item.label]));
const CODE_BY_LABEL = Object.fromEntries(COURSE_LANGUAGES.map((item) => [item.label, item.code]));

export function formatCourseLanguage(language: string): string {
  return LABEL_BY_CODE[language] ?? language;
}

export function normalizeCourseLanguageCode(language: string): string {
  if (!language) {
    return '';
  }
  const trimmed = language.trim();
  if (LABEL_BY_CODE[trimmed]) {
    return trimmed;
  }
  if (CODE_BY_LABEL[trimmed]) {
    return CODE_BY_LABEL[trimmed];
  }
  return trimmed;
}
