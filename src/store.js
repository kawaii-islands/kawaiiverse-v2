import { configureStore } from "@reduxjs/toolkit";
import AppSlice from "./slices/AppSlice";
import MessagesSlice from "./slices/MessagesSlice";

const store = configureStore({
  reducer: {
    app: AppSlice,
    messages: MessagesSlice,
  },
});

export default store;
