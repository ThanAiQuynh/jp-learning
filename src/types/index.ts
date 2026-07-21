export const JLPTLevel = {
  N5: 'N5',
  N4: 'N4',
  N3: 'N3',
  N2: 'N2',
  N1: 'N1',
} as const;
export type JLPTLevel = typeof JLPTLevel[keyof typeof JLPTLevel];

export interface LocalizedText {
  vi: string;
  en: string;
  ja?: string;
}

export const WordType = {
  Noun: 'noun',
  IAdjective: 'i-adjective',
  NaAdjective: 'na-adjective',
  VerbGroup1: 'verb-group1',
  VerbGroup2: 'verb-group2',
  VerbGroup3: 'verb-group3',
  Adverb: 'adverb',
  Particle: 'particle',
  Conjunction: 'conjunction',
  Counter: 'counter',
  Greeting: 'greeting',
  Expression: 'expression',
  Prefix: 'prefix',
  Suffix: 'suffix',
} as const;
export type WordType = typeof WordType[keyof typeof WordType];

export const ReadingType = {
  On: 'on',
  Kun: 'kun',
} as const;
export type ReadingType = typeof ReadingType[keyof typeof ReadingType];

export const DifficultyRating = {
  Again: 'again',
  Hard: 'hard',
  Good: 'good',
  Easy: 'easy',
} as const;
export type DifficultyRating = typeof DifficultyRating[keyof typeof DifficultyRating];

export const QuizType = {
  MultipleChoice: 'multiple-choice',
  Matching: 'matching',
  FillBlank: 'fill-blank',
  SentenceOrder: 'sentence-order',
} as const;
export type QuizType = typeof QuizType[keyof typeof QuizType];

// Common Types
export const Language = {
  VI: 'vi',
  EN: 'en',
} as const;
export type Language = typeof Language[keyof typeof Language];

export const Theme = {
  Light: 'light',
  Dark: 'dark',
  System: 'system',
} as const;
export type Theme = typeof Theme[keyof typeof Theme];

export const CategoryType = {
  Vocabulary: 'vocabulary',
  Grammar: 'grammar',
  Kanji: 'kanji',
} as const;
export type CategoryType = typeof CategoryType[keyof typeof CategoryType];

export const SRSStatus = {
  New: 'new',
  Learning: 'learning',
  Review: 'review',
  Relearning: 'relearning',
} as const;
export type SRSStatus = typeof SRSStatus[keyof typeof SRSStatus];

export const FlashcardMode = {
  New: 'new',
  Review: 'review',
  Mixed: 'mixed',
  Difficult: 'difficult',
} as const;
export type FlashcardMode = typeof FlashcardMode[keyof typeof FlashcardMode];

export const ItemStatus = {
  New: 'new',
  Learning: 'learning',
  Learned: 'learned',
  Relearning: 'relearning',
} as const;
export type ItemStatus = typeof ItemStatus[keyof typeof ItemStatus];

// Lesson Types
export interface Course {
  id: string;
  title: LocalizedText;
  level: JLPTLevel;
  description: LocalizedText;
  coverUrl?: string;
  totalLessons: number;
}

export interface Lesson {
  id: string;
  number: number;
  title: {
    ja: string;
    romanji: string;
  };
  description: LocalizedText;
  jlptLevel: JLPTLevel;
  chapter: number;
  courseId: string;
  vocabCount: number;
  grammarCount: number;
  kanjiCount: number;
  topics: LocalizedText[];
}

export interface LessonMapping {
  jlptLevel: JLPTLevel;
  lessonRange: {
    from: number;
    to: number;
  };
  book: 'shokyuu1' | 'shokyuu2';
}

// Vocabulary Types
export interface VocabularyItem {
  id: string;
  lessonId: string;
  kanji?: string;
  hiragana: string;
  katakana?: string;
  romaji: string;
  meaning: LocalizedText;
  wordType: WordType;
  jlptLevel: JLPTLevel;
  examples?: VocabExample[];
  notes?: LocalizedText;
  relatedKanji?: string[];
  audioFile?: string;
  tags?: string[];
}

export interface VocabExample {
  ja: string;
  reading: string;
  translation: LocalizedText;
}

// Grammar Types
export interface GrammarPattern {
  id: string;
  lessonId: string;
  pattern: string;
  patternKana: string;
  title: LocalizedText;
  explanation: LocalizedText;
  usage: LocalizedText;
  formation: string[];
  examples: GrammarExample[];
  jlptLevel: JLPTLevel;
  relatedPatterns?: string[];
  notes?: LocalizedText;
}

export interface GrammarExample {
  ja: string;
  reading: string;
  translation: LocalizedText;
  highlightRange: {
    start: number;
    end: number;
  };
}

// Kanji Types
export interface KanjiItem {
  id: string;
  lessonId: string;
  character: string;
  onReadings: string[];
  kunReadings: string[];
  meaning: LocalizedText;
  strokeCount: number;
  radicals: string[];
  primaryRadical: string;
  jlptLevel: JLPTLevel;
  gradeLevel?: number;
  frequency?: number;
  compounds: KanjiCompound[];
  strokeOrder?: string[];
  mnemonic?: LocalizedText;
}

export interface KanjiCompound {
  word: string;
  reading: string;
  meaning: LocalizedText;
  relatedVocabId?: string;
}

export interface Radical {
  id: string;
  number: number;
  character: string;
  variants: string[];
  name: {
    ja: string;
    vi: string;
    en: string;
  };
  strokeCount: number;
  meaning: LocalizedText;
  kanjiList: string[];
  group: string;
  position?: RadicalPosition;
}

export const RadicalPosition = {
  Hen: 'hen',
  Tsukuri: 'tsukuri',
  Kanmuri: 'kanmuri',
  Ashi: 'ashi',
  Tare: 'tare',
  Nyou: 'nyou',
  Kamae: 'kamae',
  Full: 'full',
} as const;
export type RadicalPosition = typeof RadicalPosition[keyof typeof RadicalPosition];

// Quiz Types
export interface QuizConfig {
  type: QuizType;
  scope: QuizScope;
  questionCount: number;
  timeLimit?: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showInstantFeedback: boolean;
}

export interface QuizScope {
  type: 'lesson' | 'level' | 'custom';
  lessonIds?: string[];
  jlptLevel?: JLPTLevel;
  category?: CategoryType;
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: {
    text: string;
    subtext?: string;
    audioFile?: string;
  };
  options: QuizOption[];
  correctAnswer: string;
  sourceId: string;
  explanation: LocalizedText;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizResult {
  quizId: string;
  config: QuizConfig;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  score: number;
  timeSpent: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

// Flashcard / SRS Types
export interface FlashcardItem {
  id: string;
  front: {
    text: string;
    subtext?: string;
  };
  back: {
    text: string;
    subtext?: string;
  };
  sourceType: CategoryType;
  sourceId: string;
  srsData: SRSData;
}

export interface SRSData {
  status: SRSStatus;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastReview: string | null;
  nextReview: string | null;
  totalReviews: number;
  correctCount: number;
  wrongCount: number;
}

export interface FlashcardSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  mode: FlashcardMode;
  lessonIds: string[];
  cardType: CategoryType | 'mixed';
  totalCards: number;
  currentIndex: number;
  ratings: {
    cardId: string;
    rating: DifficultyRating;
    timeSpent: number;
  }[];
}

// Progress Types
export interface UserProgress {
  lessons: Record<string, LessonProgress>;
  stats: {
    totalVocabLearned: number;
    totalKanjiLearned: number;
    totalGrammarLearned: number;
    totalQuizzesTaken: number;
    averageQuizScore: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
  };
  settings: UserSettings;
}

export interface LessonProgress {
  lessonId: string;
  vocabProgress: {
    total: number;
    learned: number;
    reviewing: number;
    mastered: number;
    itemStatuses: Record<string, ItemStatus>;
  };
  grammarProgress: {
    total: number;
    learned: number;
    itemStatuses: Record<string, ItemStatus>;
  };
  kanjiProgress: {
    total: number;
    learned: number;
    reviewing: number;
    mastered: number;
    itemStatuses: Record<string, ItemStatus>;
  };
  flashcardProgress: {
    totalCards: number;
    dueToday: number;
    newCards: number;
  };
  quizScores: number[];
  isCompleted: boolean;
}

export interface UserSettings {
  language: Language;
  theme: Theme;
  dailyGoal: number;
  showRomaji: boolean;
  showFurigana: boolean;
  audioAutoPlay: boolean;
}
