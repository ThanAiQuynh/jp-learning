import { Language, LocalizedText } from '@types';

/**
 * Normalizes any language string (e.g. 'vi-VN', 'vi', 'en-US', 'en') to 'vi' or 'en'.
 */
export function getNormalizedLanguage(lang?: string): Language {
  if (!lang) return Language.VI;
  const lower = lang.toLowerCase();
  if (lower.startsWith('en')) return Language.EN;
  return Language.VI;
}

/**
 * Safely extracts localized text from an object with 'vi', 'en', or 'ja' keys.
 */
export function getLocalizedText(
  textObj: LocalizedText | Record<string, string> | { ja?: string; vi?: string; en?: string; romaji?: string } | undefined | null,
  lang?: string,
  fallback = ''
): string {
  if (!textObj) return fallback;
  const currentLang = getNormalizedLanguage(lang);
  
  const val = textObj[currentLang];
  if (typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  
  // Fallbacks
  if (currentLang === Language.VI) {
    if (textObj.en && typeof textObj.en === 'string' && textObj.en.trim() !== '') return textObj.en;
  } else {
    if (textObj.vi && typeof textObj.vi === 'string' && textObj.vi.trim() !== '') return textObj.vi;
  }

  if (textObj.ja && typeof textObj.ja === 'string' && textObj.ja.trim() !== '') return textObj.ja;
  
  return fallback;
}
