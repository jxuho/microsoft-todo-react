import { fakeBaseQuery } from "@reduxjs/toolkit/dist/query";
import { firestoreApi } from "./firestoreApi";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const sortApiSlice = firestoreApi.injectEndpoints({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["sort"],
  endpoints: (builder) => ({
    getSortApi: builder.query({
      async queryFn(userId) {
        if (!userId) {
          console.error("no user id");
          return { data: {} };
        }
        try {
          const docRef = doc(db, `users/${userId}/preference`, "sortDoc");
          const docSnap = await getDoc(docRef);

          const initialSortStates = {
            myday: { sortBy: "", order: "descending" },
            important: { sortBy: "", order: "descending" },
            completed: { sortBy: "", order: "descending" },
            tasks: { sortBy: "", order: "descending" },
            search: { sortBy: "", order: "descending" },
          };

          if (!docSnap.exists()) {
            await setDoc(docRef, initialSortStates, { merge: true });
          }

          const docData = docSnap.exists() ? docSnap.data() : initialSortStates;

          return { data: docData };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["sort"],
    }),

    setSortByApi: builder.mutation({
      async queryFn({ userId, location, sortBy }) {
        try {
          const docRef = doc(db, `users/${userId}/preference`, "sortDoc");

          await setDoc(docRef, { [location]: { sortBy } }, { merge: true });
          return { data: null };
        } catch (error) {
          return { error: error.message };
        }
      },
      // 위의 firestore 저장 정상작동

      async onQueryStarted(
        { userId, location, sortBy },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData("getSortApi", userId, (draft) => {
            // console.log(JSON.stringify(draft));
            // if (JSON.stringify(draft)) draft["detailWidth"] = value;
            if (JSON.stringify(draft)) draft[location].sortBy = sortBy;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      // invalidatesTags: ["sort"],
    }),

    changeSortOrderApi: builder.mutation({
      async queryFn({ userId, location, order }) {
        console.log("changeSortOrderApi trigger");
        try {
          const docRef = doc(db, `users/${userId}/preference`, "sortDoc");
          await setDoc(docRef, { [location]: { order } }, { merge: true });
          return { data: null };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onQueryStarted(
        { userId, location, order },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData("getSortApi", userId, (draft) => {
            // console.log(JSON.stringify(draft));
            // if (JSON.stringify(draft)) draft["detailWidth"] = value;
            if (JSON.stringify(draft)) draft[location].order = order;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: ["sort"],
    }),

    initializeSortApi: builder.mutation({
      async queryFn({ userId, location }) {
        try {
          const docRef = doc(db, `users/${userId}/preference`, "sortDoc");
          await setDoc(
            docRef,
            {
              [location]: { sortBy: "", order: "descending" },
            },
            { merge: true }
          );
          return { data: null };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onQueryStarted({ userId, location }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData("getSortApi", userId, (draft) => {
            // console.log(JSON.stringify(draft));
            // if (JSON.stringify(draft)) draft["detailWidth"] = value;
            if (JSON.stringify(draft))
              draft[location] = { sortBy: "", order: "descending" };
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: ["sort"],
    }),
  }),
});

export const {
  useGetSortApiQuery,
  useSetSortByApiMutation,
  useChangeSortOrderApiMutation,
  useInitializeSortApiMutation,
} = sortApiSlice;
