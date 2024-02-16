import { configureStore } from "@reduxjs/toolkit";
import { firestoreApi } from "../api/firestoreApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import uiSliceReducer from "./uiSlice";
import activeSliceReducer from "./activeSlice"
import searchSliceReducer from "./searchSlice";


export const store =  configureStore({
  reducer: {
    [firestoreApi.reducerPath]: firestoreApi.reducer,
    ui: uiSliceReducer,
    active: activeSliceReducer,
    search: searchSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(firestoreApi.middleware), 
});


setupListeners(store.dispatch)

export default store