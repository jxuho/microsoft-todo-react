import { configureStore } from "@reduxjs/toolkit";
import uiSliceReducer from "./uiSlice";
// import sortSliceReducer from "./sortSlice"
import groupSliceReducer from "./groupSlice"
import activeSliceReducer from "./activeSlice"
import searchSliceReducer from "./searchSlice";
import authSliceReducer from "./authSlice";
import { firestoreApi } from "../api/firestoreApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";


// export default configureStore({
export const store =  configureStore({
  reducer: {
    [firestoreApi.reducerPath]: firestoreApi.reducer,
    ui: uiSliceReducer,
    // sort: sortSliceReducer,
    group: groupSliceReducer,
    active: activeSliceReducer,
    search: searchSliceReducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(firestoreApi.middleware), 
});


setupListeners(store.dispatch)

export default store