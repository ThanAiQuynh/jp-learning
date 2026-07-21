import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Language, Theme, ItemStatus } from '@types';

interface ProgressState {
  lessons: Record<string, {
    vocabProgress: Record<string, ItemStatus>;
    grammarProgress: Record<string, ItemStatus>;
    kanjiProgress: Record<string, ItemStatus>;
  }>;
  settings: {
    language: Language;
    theme: Theme;
    showFurigana: boolean;
    showRomaji: boolean;
  };
}

const initialState: ProgressState = {
  lessons: {},
  settings: {
    language: Language.VI,
    theme: Theme.System,
    showFurigana: true,
    showRomaji: true,
  },
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.settings.language = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.settings.theme = action.payload;
    },
    updateItemStatus(state, action: PayloadAction<{
      lessonId: string;
      category: 'vocabProgress' | 'grammarProgress' | 'kanjiProgress';
      itemId: string;
      status: ItemStatus;
    }>) {
      const { lessonId, category, itemId, status } = action.payload;
      if (!state.lessons[lessonId]) {
        state.lessons[lessonId] = {
          vocabProgress: {},
          grammarProgress: {},
          kanjiProgress: {},
        };
      }
      state.lessons[lessonId][category][itemId] = status;
    },
    toggleFurigana(state) {
      state.settings.showFurigana = !state.settings.showFurigana;
    },
    toggleRomaji(state) {
      state.settings.showRomaji = !state.settings.showRomaji;
    },
  },
});

export const { setLanguage, setTheme, updateItemStatus, toggleFurigana, toggleRomaji } = progressSlice.actions;
export default progressSlice.reducer;
