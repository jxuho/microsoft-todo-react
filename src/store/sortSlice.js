// import { createSlice } from "@reduxjs/toolkit";

// const sortSlice = createSlice({
//   name: "sortOption",
//   initialState: {
//     myday: { sortBy: "", order: "descending" },
//     important: { sortBy: "", order: "descending" },
//     completed: { sortBy: "", order: "descending" },
//     tasks: { sortBy: "", order: "descending" },
//     search: {sortBy: "", order: "descending"}
//   },
//   // sortBy: importance, dueDate, alphabetically, creationDate, myday, completed

//   reducers: {
//     setSortBy: (state, action) => {
//       // dispatch(setSortBy({option:'importance', location: 'myday'}))
//       const { option, location } = action.payload;
//       state[location].sortBy = option;
//     },
//     changeOrder: (state, action) => {
//       // dispatch(changeOrder('myday'))
//       const location = action.payload;
//       if (state[location].order === "descending") {
//         state[location].order = "ascending";
//       } else {
//         state[location].order = "descending";
//       }
//     },
//     initializeSort: (state, action) => {
//       // dispatch(initializeSort('myday'))
//       const location = action.payload;
//       state[location] = { sortBy: "", order: "descending" };
//     },
//   },
// });

// export const { setSortBy, changeOrder, initializeSort } = sortSlice.actions;

// export default sortSlice.reducer;
