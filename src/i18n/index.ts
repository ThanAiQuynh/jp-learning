import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './locales/vi/common.json';
import enCommon from './locales/en/common.json';
import jaCommon from './locales/ja/common.json';

import viVocabulary from './locales/vi/vocabulary.json';
import enVocabulary from './locales/en/vocabulary.json';
import jaVocabulary from './locales/ja/vocabulary.json';

import viGrammar from './locales/vi/grammar.json';
import enGrammar from './locales/en/grammar.json';
import jaGrammar from './locales/ja/grammar.json';

import viKanji from './locales/vi/kanji.json';
import enKanji from './locales/en/kanji.json';
import jaKanji from './locales/ja/kanji.json';

import viDashboard from './locales/vi/dashboard.json';
import enDashboard from './locales/en/dashboard.json';
import jaDashboard from './locales/ja/dashboard.json';

import viFlashcard from './locales/vi/flashcard.json';
import enFlashcard from './locales/en/flashcard.json';
import jaFlashcard from './locales/ja/flashcard.json';

import viQuiz from './locales/vi/quiz.json';
import enQuiz from './locales/en/quiz.json';
import jaQuiz from './locales/ja/quiz.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, vocabulary: viVocabulary, grammar: viGrammar, kanji: viKanji, dashboard: viDashboard, flashcard: viFlashcard, quiz: viQuiz },
      en: { common: enCommon, vocabulary: enVocabulary, grammar: enGrammar, kanji: enKanji, dashboard: enDashboard, flashcard: enFlashcard, quiz: enQuiz },
      ja: { common: jaCommon, vocabulary: jaVocabulary, grammar: jaGrammar, kanji: jaKanji, dashboard: jaDashboard, flashcard: jaFlashcard, quiz: jaQuiz },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
