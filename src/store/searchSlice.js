import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {query: "", showCompleted: false},

  reducers: {
    addQuery: (state, action) => {
      //dispatch(addQuery("query"))
      state.query = action.payload
    },
    initializeQuery: (state) => {
      // dispatch(initializeQuery())
      state.query = ""
    },
    switchShowCompleted: (state) => {
      state.showCompleted = !state.showCompleted
    },
    initializeSearch: (state) => ({...state, query: "", showCompleted: false})
  },
});

export const { addQuery, initializeQuery, switchShowCompleted, initializeSearch } = searchSlice.actions;

export default searchSlice.reducer;
