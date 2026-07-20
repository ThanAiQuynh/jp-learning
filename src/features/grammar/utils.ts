import { Language } from '@types';

/**
 * Formats a grammar pattern string by expanding abbreviations (e.g., N1, V-te)
 * based on the current language context.
 */
export const formatGrammarPattern = (pattern: string, lang: Language): string => {
  if (lang === 'vi') {
    return pattern
      .replace(/N([0-9]*)/g, 'Danh từ $1')
      .replace(/Danh từ  /g, 'Danh từ ') // Cleanup extra space if any
      .trim();
  }
  
  if (lang === 'en') {
    return pattern
      .replace(/N([0-9]*)/g, 'Noun $1')
      .replace(/Noun  /g, 'Noun ')
      .trim();
  }

  // Japanese (default or other)
  return pattern
    .replace(/N([0-9]*)/g, '名詞$1')
    .trim();
};
