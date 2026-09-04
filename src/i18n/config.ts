import { Language } from '../types';

export interface LanguageOption {
  code: string;
  name: Language;
  nativeName: string;
  flagEmoji: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flagEmoji: '🇬🇧' },
  { code: 'hi', name: 'Hindi' as Language, nativeName: 'हिंदी', flagEmoji: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flagEmoji: '🌺' },
  { code: 'bn', name: 'Bengali' as Language, nativeName: 'বাংলা', flagEmoji: '🇧🇩' },
  { code: 'ne', name: 'Nepali' as Language, nativeName: 'নেপালী', flagEmoji: '🇳🇵' },
  { code: 'mn', name: 'Manipuri' as Language, nativeName: 'মৈতৈলোন্ / ꯃꯩꯇꯩꯂꯣꯟ', flagEmoji: '🏞️' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर’', flagEmoji: '🏹' },
  { code: 'kha', name: 'Khasi', nativeName: 'Khasi', flagEmoji: '🌲' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo', flagEmoji: '⛰️' },
  { code: 'nag', name: 'Nagamese', nativeName: 'Nagamese', flagEmoji: '🌄' },
];

export const DEFAULT_LANGUAGE_CODE = 'en';
export const FALLBACK_LANGUAGE_CODE = 'en';
