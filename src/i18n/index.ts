import { Language } from '../types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE_CODE, FALLBACK_LANGUAGE_CODE } from './config';
import enCommon from './locales/en/common.json';
import hiCommon from './locales/hi/common.json';
import asCommon from './locales/as/common.json';

const STORAGE_KEY = 'vanika_language_preference';

const dictionaries: Record<string, any> = {
  en: enCommon,
  hi: hiCommon,
  as: asCommon,
  bn: enCommon, // Safe fallback
  ne: enCommon,
  mn: enCommon,
  brx: enCommon,
  kha: enCommon,
  lus: enCommon,
  nag: enCommon,
};

class I18nManager {
  private currentLanguageCode: string = DEFAULT_LANGUAGE_CODE;
  private listeners: Array<(langCode: string) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && this.isSupported(saved)) {
        this.currentLanguageCode = saved;
      }
    } catch {
      this.currentLanguageCode = DEFAULT_LANGUAGE_CODE;
    }
  }

  public isSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some((l) => l.code === code || l.name.toLowerCase() === code.toLowerCase());
  }

  public getLanguageCode(): string {
    return this.currentLanguageCode;
  }

  public getLanguageName(): Language {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLanguageCode);
    return found ? found.name : 'English';
  }

  public setLanguage(codeOrName: string): void {
    const found = SUPPORTED_LANGUAGES.find(
      (l) => l.code === codeOrName || l.name.toLowerCase() === codeOrName.toLowerCase()
    );

    const targetCode = found ? found.code : FALLBACK_LANGUAGE_CODE;
    this.currentLanguageCode = targetCode;

    try {
      localStorage.setItem(STORAGE_KEY, targetCode);
    } catch {}

    this.notifyListeners();
  }

  public subscribe(listener: (langCode: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentLanguageCode));
  }

  /**
    Translates a key with safe fallback to English and variable interpolation (e.g. {{name}}).
   */
  public t(key: string, params?: Record<string, string | number>): string {
    const currentDict = dictionaries[this.currentLanguageCode] || dictionaries[FALLBACK_LANGUAGE_CODE];
    const fallbackDict = dictionaries[FALLBACK_LANGUAGE_CODE];

    let value = this.resolveKeyPath(currentDict, key);

    // Fallback to English if missing in current dictionary
    if (value === undefined) {
      value = this.resolveKeyPath(fallbackDict, key);
    }

    if (value === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing translation key: "${key}" for language "${this.currentLanguageCode}"`);
      }
      return key; // Returns raw key safely without crashing
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Perform variable interpolation {{varName}}
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
        return params[varName] !== undefined ? String(params[varName]) : `{{${varName}}}`;
      });
    }

    return value;
  }

  private resolveKeyPath(obj: any, path: string): any {
    if (!obj || typeof obj !== 'object') return undefined;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  // ─── Locale-Aware Formatting Utilities ───

  public formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    try {
      const d = new Date(date);
      const locale = this.getLocaleString();
      return new Intl.DateTimeFormat(locale, options || { dateStyle: 'medium' }).format(d);
    } catch {
      return String(date);
    }
  }

  public formatTime(date: Date | string | number): string {
    try {
      const d = new Date(date);
      const locale = this.getLocaleString();
      return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(d);
    } catch {
      return String(date);
    }
  }

  public formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    try {
      const locale = this.getLocaleString();
      return new Intl.NumberFormat(locale, options).format(value);
    } catch {
      return String(value);
    }
  }

  public formatPercent(value: number): string {
    try {
      const locale = this.getLocaleString();
      return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value / 100);
    } catch {
      return `${value}%`;
    }
  }

  private getLocaleString(): string {
    const localeMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      as: 'as-IN',
      bn: 'bn-IN',
      ne: 'ne-NP',
      mn: 'mni-IN',
    };
    return localeMap[this.currentLanguageCode] || 'en-IN';
  }
}

export const i18n = new I18nManager();
export const t = (key: string, params?: Record<string, string | number>) => i18n.t(key, params);
