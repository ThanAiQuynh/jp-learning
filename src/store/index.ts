import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './slices/progressSlice';
import { loadState, saveState } from '../utils/storage';

const PERSISTED_KEYS = {
  progress: 'japanese_app_progress',
};

const preloadedState = {
  progress: loadState(PERSISTED_KEYS.progress),
};

export const store = configureStore({
  reducer: {
    progress: progressReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(PERSISTED_KEYS.progress, store.getState().progress);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
