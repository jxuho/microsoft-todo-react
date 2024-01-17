import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "groupOption",
  initialState: {
    myday: { groupBy: "" },
    important: { groupBy: "" },
    completed: { groupBy: "" },
    tasks: { groupBy: "" },
  },

  reducers: {
    setGroupBy: (state, action) => {
      //dispatch(setGroupBy({option:"category", location: "myday"}))
      const { option, location } = action.payload;
      state[location].groupBy = option;
    },
    initializeGroup: (state, action) => {
      // dispatch(initializeState('myday'))
      const location = action.payload;
      state[location] = { groupBy: "" };
    },
  },
});

export const { setGroupBy, initializeGroup } = groupSlice.actions;

export default groupSlice.reducer;
