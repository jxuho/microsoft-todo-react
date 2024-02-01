import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestoreApi } from "./firestoreApi";

export const uiApiSlice = firestoreApi.injectEndpoints({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["ui"],
  endpoints: (builder) => ({
    getUiApi: builder.query({
      async queryFn(userId) {
        if (!userId) {
          return { data: null };
        }
        try {

          // console.log('getUiApi');

          const docRef = doc(db, `users/${userId}/preference`, "uiDoc");
          const docSnap = await getDoc(docRef);

          const initialUiStates = {
            detailWidth: 360,
            theme: "light",
          };
          if (!docSnap.exists()) {
            await setDoc(docRef, initialUiStates, { merge: true });
          }
          const docData = docSnap.exists() ? docSnap.data() : initialUiStates;

          return { data: docData };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["ui"],
    }),

    setDetailWidthApi: builder.mutation({
      async queryFn({ userId, value }) {
        try {
          console.log('setDetailWidthApi');
          const docRef = doc(db, `users/${userId}/preference`, "uiDoc");
          await setDoc(
            docRef,
            {
              detailWidth: value,
            },
            { merge: true }
          );
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      async onQueryStarted({ userId, value }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData("getUiApi", userId, (draft) => {
            // console.log(JSON.stringify(draft));
            if (JSON.stringify(draft)) draft["detailWidth"] = value;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["ui"],
    }),

    setThemeApi: builder.mutation({
      async queryFn({ userId, value }) {
        try {
          console.log("setThemeApi");
          const docRef = doc(db, `users/${userId}/preference`, "uiDoc");
          await setDoc(
            docRef,
            {
              theme: value,
            },
            { merge: true }
          );
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      async onQueryStarted({ userId, value }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          firestoreApi.util.updateQueryData("getUiApi", userId, (draft) => {
            if (JSON.stringify(draft)) draft["theme"] = value;
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },

      invalidatesTags: ["ui"],
    }),
  }),
});

export const {
  useGetUiApiQuery,
  useSetDetailWidthApiMutation,
  useSetThemeApiMutation,
} = uiApiSlice;
