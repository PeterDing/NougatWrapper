import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IJob } from "../database/job";

export interface IJobState {
  entities: IJob[];
}

const initialState: IJobState = {
  entities: [],
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<IJob[]>) => {
      state.entities = action.payload;
    },
    addJob: (state, action: PayloadAction<IJob>) => {
      state.entities.push(action.payload);
    },
    updateJob: (state, action: PayloadAction<IJob>) => {
      const index = state.entities.findIndex(
        (job) => job.id === action.payload.id
      );
      if (index !== -1) {
        state.entities[index] = action.payload;
      }
    },
    removeJob: (state, action: PayloadAction<number>) => {
      state.entities = state.entities.filter(
        (job) => job.id !== action.payload
      );
    },
    clearJobs: (state) => {
      state.entities = [];
    },
  },
});

export const { setJobs, addJob, updateJob, removeJob, clearJobs } =
  jobsSlice.actions;
export default jobsSlice.reducer;
