import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "./checkoutSlice";

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
  },
});