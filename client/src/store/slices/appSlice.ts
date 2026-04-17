import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../types/domain';

interface AppState {
  appName: string;
  user: AuthUser | null;
  token: string | null;
  authChecked: boolean;
}

const initialState: AppState = {
  appName: 'VSVH',
  user: null,
  token: null,
  authChecked: false,
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
  },
});

export const { setSession, setUser, clearSession } = appSlice.actions;
