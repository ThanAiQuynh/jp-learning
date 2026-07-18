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
  };
}

const initialState: ProgressState = {
  lessons: {},
  settings: {
    language: Language.VI,
    theme: Theme.System,
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
  },
});

export const { setLanguage, setTheme, updateItemStatus } = progressSlice.actions;
export default progressSlice.reducer;
