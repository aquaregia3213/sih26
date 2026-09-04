import { useState, useEffect } from 'react';
import { i18n } from './index';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES, LanguageOption } from './config';

export function useTranslation() {
  const [langCode, setLangCode] = useState<string>(i18n.getLanguageCode());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((newCode) => {
      setLangCode(newCode);
    });
    return unsubscribe;
  }, []);

  const changeLanguage = (codeOrName: string) => {
    i18n.setLanguage(codeOrName);
  };

  return {
    t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
    currentLanguageCode: langCode,
    currentLanguageName: i18n.getLanguageName(),
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    formatDate: (d: Date | string | number) => i18n.formatDate(d),
    formatTime: (d: Date | string | number) => i18n.formatTime(d),
    formatNumber: (n: number) => i18n.formatNumber(n),
    formatPercent: (p: number) => i18n.formatPercent(p),
  };
}
