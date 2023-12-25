import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface INavigatorState {
  currentScreen: string;
  currentJobId: number | null;
}

const initialState: INavigatorState = {
  currentScreen: "job-list", // screencapture, job-list, job-detail, loading, settings
  currentJobId: null,
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
  },
});

export const { navigate, setCurrentJobId } = navigatorSlice.actions;

export default navigatorSlice.reducer;
