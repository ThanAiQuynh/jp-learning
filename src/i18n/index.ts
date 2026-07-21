import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './locales/vi/common.json';
import enCommon from './locales/en/common.json';

import viVocabulary from './locales/vi/vocabulary.json';
import enVocabulary from './locales/en/vocabulary.json';

import viGrammar from './locales/vi/grammar.json';
import enGrammar from './locales/en/grammar.json';

import viKanji from './locales/vi/kanji.json';
import enKanji from './locales/en/kanji.json';

import viDashboard from './locales/vi/dashboard.json';
import enDashboard from './locales/en/dashboard.json';

import viFlashcard from './locales/vi/flashcard.json';
import enFlashcard from './locales/en/flashcard.json';

import viQuiz from './locales/vi/quiz.json';
import enQuiz from './locales/en/quiz.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon, vocabulary: viVocabulary, grammar: viGrammar, kanji: viKanji, dashboard: viDashboard, flashcard: viFlashcard, quiz: viQuiz },
      en: { common: enCommon, vocabulary: enVocabulary, grammar: enGrammar, kanji: enKanji, dashboard: enDashboard, flashcard: enFlashcard, quiz: enQuiz },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
