import { createSlice } from "@reduxjs/toolkit";
import { setAll } from "src/helpers";

const AppSlice = createSlice({
  name: "app",
  initialState: {
    loading: false,
  },
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
});

export const { fetchAppSuccess } = AppSlice.actions;

export default AppSlice.reducer;
