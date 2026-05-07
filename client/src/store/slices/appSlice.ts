import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  appName: string;
  authChecked: boolean;
  theme: 'light' | 'dark';
  uiLanguage: 'ru' | 'en';
}

const initialState: AppState = {
  appName: 'VSVH',
  authChecked: false,
  theme: 'light',
  uiLanguage: 'ru',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.authChecked = action.payload;
    },
    clearSession(state) {
      state.authChecked = true;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setUiLanguage(state, action: PayloadAction<'ru' | 'en'>) {
      state.uiLanguage = action.payload;
    },
  },
});

export const { setAuthChecked, clearSession, setTheme, setUiLanguage } = appSlice.actions;
