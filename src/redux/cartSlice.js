import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "../api/shopify";

const CART_ID_KEY = "shopify_cart_id";

async function persistCartId(cart) {
  if (cart?.id) {
    await AsyncStorage.setItem(CART_ID_KEY, cart.id);
  } else {
    await AsyncStorage.removeItem(CART_ID_KEY);
  }
}

/**
 * Rehydrate the cart on app launch from the persisted cart id. Shopify carts
 * expire (and are emptied once checkout completes), so a null response means we
 * drop the stored id and start fresh.
 */
export const initCart = createAsyncThunk("cart/init", async () => {
  const cartId = await AsyncStorage.getItem(CART_ID_KEY);
  if (!cartId) return null;

  const cart = await getCart(cartId);
  if (!cart) {
    await AsyncStorage.removeItem(CART_ID_KEY);
    return null;
  }
  return cart;
});

/**
 * Add a variant to the cart, creating the cart on first add.
 */
export const addItem = createAsyncThunk(
  "cart/addItem",
  async ({ variantId, quantity = 1 }, { getState }) => {
    const { cart } = getState().cart;
    const lines = [{ merchandiseId: variantId, quantity }];

    const updated = cart?.id
      ? await addCartLines(cart.id, lines)
      : await createCart(lines);

    await persistCartId(updated);
    return updated;
  }
);

export const changeLineQuantity = createAsyncThunk(
  "cart/changeLineQuantity",
  async ({ lineId, quantity }, { getState }) => {
    const { cart } = getState().cart;
    if (!cart?.id) return cart;

    if (quantity < 1) {
      return removeCartLines(cart.id, [lineId]);
    }
    return updateCartLines(cart.id, [{ id: lineId, quantity }]);
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async ({ lineId }, { getState }) => {
    const { cart } = getState().cart;
    if (!cart?.id) return cart;
    return removeCartLines(cart.id, [lineId]);
  }
);

const initialState = {
  cart: null,
  status: "idle", // idle | loading | error
  error: null,
  mutatingLineId: null, // id of the line currently being updated/removed
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      AsyncStorage.removeItem(CART_ID_KEY);
    },
  },
  extraReducers: (builder) => {
    // Line-level mutations track which line is busy so the UI can show a
    // spinner on just that row.
    const lineMutations = [changeLineQuantity, removeItem];
    lineMutations.forEach((thunk) => {
      builder.addCase(thunk.pending, (state, action) => {
        state.mutatingLineId = action.meta.arg.lineId;
      });
    });

    builder
      .addCase(initCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItem.pending, (state) => {
        state.error = null;
      });

    // Every fulfilled cart thunk stores the returned cart the same way.
    [initCart, addItem, changeLineQuantity, removeItem].forEach((thunk) => {
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "idle";
        state.error = null;
        state.mutatingLineId = null;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
        state.mutatingLineId = null;
      });
    });
  },
});

export const { clearCart } = cartSlice.actions;

/* Selectors */
export const selectCart = (state) => state.cart.cart;
export const selectCartCount = (state) => state.cart.cart?.totalQuantity ?? 0;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectMutatingLineId = (state) => state.cart.mutatingLineId;

export default cartSlice.reducer;
