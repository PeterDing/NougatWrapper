import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface INavigatorState {
  currentScreen: string;
  currentJobId: number | null;
  error: string;
}

const initialState: INavigatorState = {
  // Screens: screencapture, job-list, job-detail, loading, settings, error
  currentScreen: "job-list",
  currentJobId: null,
  error: "",
};

export const navigatorSlice = createSlice({
  name: "navigator",
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
      if (action.payload === "job-list") {
        state.currentJobId = null;
      }
    },
    setCurrentJobId: (state, action: PayloadAction<number>) => {
      state.currentScreen = "job-detail";
      state.currentJobId = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.currentScreen = "error";
      state.error = action.payload;
    },
  },
});

export const { navigate, setCurrentJobId, setError } = navigatorSlice.actions;

export default navigatorSlice.reducer;
