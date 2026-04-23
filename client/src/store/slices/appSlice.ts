import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types/domain';

interface AppState {
  appName: string;
  user: AuthUser | null;
  token: string | null;
  authChecked: boolean;
  theme: 'light' | 'dark';
  uiLanguage: 'ru' | 'en';
}

const initialState: AppState = {
  appName: 'VSVH',
  user: null,
  token: null,
  authChecked: false,
  theme: 'light',
  uiLanguage: 'ru',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authChecked = true;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.authChecked = true;
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
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

export const { setSession, setUser, clearSession, setTheme, setUiLanguage } = appSlice.actions;
