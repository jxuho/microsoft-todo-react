import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";



export const firestoreApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["todos", "ui", "user", "sort", "group"],
  endpoints: () => ({})
})


