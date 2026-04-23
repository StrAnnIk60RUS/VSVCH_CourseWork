import { I18N_DICTIONARY } from '../constants/i18n';
import { useAppSelector } from '../store/hooks';

export function useI18n() {
  const uiLanguage = useAppSelector((state) => state.app.uiLanguage);
  return I18N_DICTIONARY[uiLanguage];
}
