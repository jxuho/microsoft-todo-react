import { createSlice } from "@reduxjs/toolkit";

const activeSlice = createSlice({
  name: "active",
  initialState: {
    activeTasks: [],
    activeStep: "",
    activeRange: [],
    activeFileRef: "",
  },

  reducers: {
    addActiveTasks: (state, action) => {
      //dispatch(addActive(taskId))
      state.activeTasks.push(action.payload);
    },
    addActiveStep: (state, action) => {
      //dispatch(addActive(taskId))
      state.activeStep = action.payload;
    },
    removeActiveTask: (state, action) => {
      // dispatch(removeActiveTask(taskId))
      state.activeTasks = state.activeTasks.filter(
        (task) => task !== action.payload
      );
    },
    setActiveFileRef: (state, action) => {
      state.activeFileRef = action.payload;
    },

    initializeActiveTasks: (state) => {
      // dispatch(initializeActiveTask())
      state.activeTasks = [];
    },
    initializeActiveStep: (state) => {
      // dispatch(initializeActiveStep())
      state.activeStep = "";
    },
    setActiveRange: (state, action) => {
      state.activeRange = [state.activeTasks[0], action.payload];
    },
    initializeActiveRange: (state) => {
      state.activeRange = [];
    },
    initializeActive: (state) => ({
      ...state,
      activeTasks: [],
      activeStep: "",
      activeRange: [],
      activeFileRef: "",
    }),
  },
});

export const {
  addActiveTasks,
  addActiveStep,
  removeActiveTask,
  setActiveFileRef,
  initializeActiveTasks,
  initializeActiveStep,
  setActiveRange,
  initializeActiveRange,
  initializeActive,
} = activeSlice.actions;

export default activeSlice.reducer;
