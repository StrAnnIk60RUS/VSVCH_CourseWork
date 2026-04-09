import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  appName: string;
}

const initialState: AppState = {
  appName: 'VSVH',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
});
