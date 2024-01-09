import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebar: false,
    detail: false,
    contextMenu: false,
    dialog: false,
    detailWidth: 360,
    searchbarActive: false,
    appLauncherActive: false,
    accountManagerActive: false,
    settingsActive: false,
    helpActive: false,
    whatsNewActive: false,
    // theme: "light"
  },
  reducers: {
    openSidebar: (state) => ({ ...state, sidebar: true }),
    closeSidebar: (state) => ({ ...state, sidebar: false }),
    openDetail: (state) => ({ ...state, detail: true }),
    closeDetail: (state) => ({ ...state, detail: false }),
    openContextMenu: (state) => {
      state.contextMenu = true;
    },
    closeContextMenu: (state) => {
      state.contextMenu = false;
    },
    setDialog: (state, action) => {
      state.dialog = action.payload;
    },
    setDetailWidth: (state, action) => {
      state.detailWidth = action.payload;
    },
    setSearchbarActive: (state, action) => {
      state.searchbarActive = action.payload;
    },
    setAppLauncherActive: (state, action) => {
      state.appLauncherActive = action.payload;
    },
    setHeaderButton: (state, action) => {
      state[action.payload.property] = action.payload.value
    },
    switchHeaderButton: (state, action) => {
      state[action.payload.property] = !state[action.payload.property]
    },
    // setTheme: (state, action) => {
    //   state.theme = action.payload;
    // }
  },
});

export const {
  openSidebar,
  closeSidebar,
  openDetail,
  closeDetail,
  openContextMenu,
  closeContextMenu,
  setDialog,
  setDetailWidth,
  setSearchbarActive,
  setAppLauncherActive,
  setHeaderButton,
  switchHeaderButton,
  // setTheme,
} = uiSlice.actions;
export default uiSlice.reducer;
