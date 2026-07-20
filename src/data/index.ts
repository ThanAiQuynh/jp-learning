import { VocabularyItem, GrammarPattern, KanjiItem, Radical } from '@types';

// Use Vite's import.meta.glob to dynamically import all json files
const vocabModules = import.meta.glob('./vocabulary/*.json');
const grammarModules = import.meta.glob('./grammar/*.json');
const kanjiModules = import.meta.glob('./kanji/*.json');

/**
 * Helper to fetch data asynchronously based on lessonId
 */
export const getVocabForLesson = async (lessonId: string): Promise<VocabularyItem[]> => {
  const path = `./vocabulary/${lessonId}.json`;
  if (vocabModules[path]) {
    const module = (await vocabModules[path]()) as { default: VocabularyItem[] };
    return module.default;
  }
  return [];
};

export const getGrammarForLesson = async (lessonId: string): Promise<GrammarPattern[]> => {
  const path = `./grammar/${lessonId}.json`;
  if (grammarModules[path]) {
    const module = (await grammarModules[path]()) as { default: GrammarPattern[] };
    return module.default;
  }
  return [];
};

export const getKanjiForLesson = async (lessonId: string): Promise<KanjiItem[]> => {
  const path = `./kanji/${lessonId}.json`;
  if (kanjiModules[path]) {
    const module = (await kanjiModules[path]()) as { default: KanjiItem[] };
    return module.default;
  }
  return [];
};

export const getAllVocab = async (): Promise<VocabularyItem[]> => {
  const all = await Promise.all(Object.values(vocabModules).map(m => m() as Promise<{ default: VocabularyItem[] }>));
  return all.flatMap(m => m.default);
};

export const getAllGrammar = async (): Promise<GrammarPattern[]> => {
  const all = await Promise.all(Object.values(grammarModules).map(m => m() as Promise<{ default: GrammarPattern[] }>));
  return all.flatMap(m => m.default);
};

export const getAllKanji = async (): Promise<KanjiItem[]> => {
  const all = await Promise.all(Object.values(kanjiModules).map(m => m() as Promise<{ default: KanjiItem[] }>));
  return all.flatMap(m => m.default);
};

/**
 * Fetch all 214 Kangxi radicals
 */
export const getAllRadicals = async (): Promise<Radical[]> => {
  const module = await import('./radicals/radicals.json');
  return module.default as Radical[];
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
