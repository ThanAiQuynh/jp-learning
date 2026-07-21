import { VocabularyItem, GrammarPattern, KanjiItem, Radical } from '@types';

// Use Vite's import.meta.glob to dynamically import all json files
const vocabModules = import.meta.glob('./vocabulary/*.json');
const grammarModules = import.meta.glob('./grammar/*.json');
const kanjiModules = import.meta.glob('./kanji/*.json');

// In-memory caches to prevent re-parsing JSON arrays on repeated lookups
let cachedAllVocab: Promise<VocabularyItem[]> | null = null;
let cachedAllGrammar: Promise<GrammarPattern[]> | null = null;
let cachedAllKanji: Promise<KanjiItem[]> | null = null;
let cachedAllRadicals: Promise<Radical[]> | null = null;

const lessonVocabCache: Record<string, Promise<VocabularyItem[]>> = {};
const lessonGrammarCache: Record<string, Promise<GrammarPattern[]>> = {};
const lessonKanjiCache: Record<string, Promise<KanjiItem[]>> = {};

/**
 * Helper to fetch data asynchronously based on lessonId
 */
export const getVocabForLesson = async (lessonId: string): Promise<VocabularyItem[]> => {
  const path = `./vocabulary/${lessonId}.json`;
  if (!vocabModules[path]) return [];
  if (!lessonVocabCache[path]) {
    lessonVocabCache[path] = (vocabModules[path]() as Promise<{ default: VocabularyItem[] }>).then(m => m.default);
  }
  return lessonVocabCache[path];
};

export const getGrammarForLesson = async (lessonId: string): Promise<GrammarPattern[]> => {
  const path = `./grammar/${lessonId}.json`;
  if (!grammarModules[path]) return [];
  if (!lessonGrammarCache[path]) {
    lessonGrammarCache[path] = (grammarModules[path]() as Promise<{ default: GrammarPattern[] }>).then(m => m.default);
  }
  return lessonGrammarCache[path];
};

export const getKanjiForLesson = async (lessonId: string): Promise<KanjiItem[]> => {
  const path = `./kanji/${lessonId}.json`;
  if (!kanjiModules[path]) return [];
  if (!lessonKanjiCache[path]) {
    lessonKanjiCache[path] = (kanjiModules[path]() as Promise<{ default: KanjiItem[] }>).then(m => m.default);
  }
  return lessonKanjiCache[path];
};

export const getAllVocab = async (): Promise<VocabularyItem[]> => {
  if (!cachedAllVocab) {
    cachedAllVocab = Promise.all(
      Object.values(vocabModules).map(m => m() as Promise<{ default: VocabularyItem[] }>)
    ).then(all => all.flatMap(m => m.default));
  }
  return cachedAllVocab;
};

export const getAllGrammar = async (): Promise<GrammarPattern[]> => {
  if (!cachedAllGrammar) {
    cachedAllGrammar = Promise.all(
      Object.values(grammarModules).map(m => m() as Promise<{ default: GrammarPattern[] }>)
    ).then(all => all.flatMap(m => m.default));
  }
  return cachedAllGrammar;
};

export const getAllKanji = async (): Promise<KanjiItem[]> => {
  if (!cachedAllKanji) {
    cachedAllKanji = Promise.all(
      Object.values(kanjiModules).map(m => m() as Promise<{ default: KanjiItem[] }>)
    ).then(all => all.flatMap(m => m.default));
  }
  return cachedAllKanji;
};

/**
 * Fetch all 214 Kangxi radicals
 */
export const getAllRadicals = async (): Promise<Radical[]> => {
  if (!cachedAllRadicals) {
    cachedAllRadicals = import('./radicals/radicals.json').then(module => module.default as Radical[]);
  }
  return cachedAllRadicals;
};

/**
 * Fetch radicals filtered by stroke count group
 */
export const getRadicalsByStrokeCount = async (strokeCount: number): Promise<Radical[]> => {
  const all = await getAllRadicals();
  return all.filter(r => r.strokeCount === strokeCount);
};

/**
 * Find radicals by character
 */
export const getRadicalByCharacter = async (character: string): Promise<Radical | undefined> => {
  const all = await getAllRadicals();
  return all.find(r => r.character === character || r.variants.includes(character));
};
