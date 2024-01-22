import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth", 
  initialState: {
    isAuthenticated: false,
    // user: null
    user: {
      email: "",
      uid: "",
      displayName: "",
      photoUrl: ""
    }
  },

  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      // state.user = null;
      state.user = {
        email: "",
        uid: "",
        displayName: "",
        photoUrl: ""
      };
    },
  }
})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;