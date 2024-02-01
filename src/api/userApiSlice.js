import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestoreApi } from "./firestoreApi";

export const userApiSlice = firestoreApi.injectEndpoints({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    getUserApi: builder.query({
      async queryFn(userId) {
        if (!userId) {
          return { data: null };
        }
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          const initialUserStates = {
            email: auth.currentUser.email,
            updated: ""
          }
          if (!docSnap.exists()) {
            await setDoc(docRef, initialUserStates, { merge: true });
          }
          const docData = docSnap.exists() ? docSnap.data() : initialUserStates;

          return { data: docData };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["user"],
    }),


    setUpdatedApi: builder.mutation({
      async queryFn({ userId, updated }) {
        try {
          await updateDoc(doc(db, "users", userId), { updated});
          return { data: null };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["user"]
    }),
  }),
});

export const { useGetUserApiQuery, useSetUpdatedApiMutation } = userApiSlice;


