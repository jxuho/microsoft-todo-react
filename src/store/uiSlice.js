import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebar: false,
    detail: false,
    contextMenu: false,
    deleteDialogTarget: "",
    deleteDialogActive: false,
    detailWidth: 360,
    searchbarActive: false,
    appLauncherActive: false,
    accountManagerActive: false,
    settingsActive: false,
    helpActive: false,
    whatsNewActive: false,
    informationModalActive: false,
    informationModalText: "",
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

    setDeleteDialogActive: (state, action) => {
      state.deleteDialogActive = action.payload.active;
      state.deleteDialogTarget = action.payload.target;
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
      state[action.payload.property] = action.payload.value;
    },
    switchHeaderButton: (state, action) => {
      state[action.payload.property] = !state[action.payload.property];
    },

    setInformationModal: (state, action) => {
      state.informationModalActive = action.payload.active;
      state.informationModalText = action.payload.text;
    },
    initializeUi: (state) => ({
      ...state,
      sidebar: false,
      detail: false,
      contextMenu: false,
      deleteDialogTarget: "",
      deleteDialogActive: false,
      detailWidth: 360,
      searchbarActive: false,
      appLauncherActive: false,
      accountManagerActive: false,
      settingsActive: false,
      helpActive: false,
      whatsNewActive: false,
      informationModalActive: false,
      informationModalText: "",
    }),
  },
});

export const {
  openSidebar,
  closeSidebar,
  openDetail,
  closeDetail,
  openContextMenu,
  closeContextMenu,
  setDeleteDialogActive,
  setDetailWidth,
  setSearchbarActive,
  setAppLauncherActive,
  setHeaderButton,
  switchHeaderButton,
  setInformationModal,
  initializeUi,
} = uiSlice.actions;
export default uiSlice.reducer;
