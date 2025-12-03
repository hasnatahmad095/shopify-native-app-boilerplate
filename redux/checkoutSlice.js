import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
  },
  reducers: {
    setCheckout: (state, action) => {
      state.checkout = action.payload;
    },
    clearCheckout: (state) => {
      state.checkout = null;
    },
  },
});

export const { setCheckout, clearCheckout } = checkoutSlice.actions;
export const selectCheckout = (state) => state.checkout.checkout;
export default checkoutSlice.reducer;