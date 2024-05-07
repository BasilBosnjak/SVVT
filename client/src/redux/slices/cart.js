import { createSlice } from "@reduxjs/toolkit";

const calculateSubtotal = (cartState) => {
  let result = 0;
  cartState.map((item) => (result += item.qty * item.price));
  return result;
};

export const initialState = {
  loading: false,
  error: null,
  cartItems: JSON.parse(localStorage.getItem("cartItems")) ?? [],
  shipping: JSON.parse(localStorage.getItem("shipping")) ?? Number(9.99),
  subtotal: localStorage.getItem("cartItems")
    ? calculateSubtotal(JSON.parse(localStorage.getItem("cartItems")))
    : 0,
};

const updateLocalStorage = (cart) => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
  localStorage.setItem("subtotal", JSON.stringify(calculateSubtotal(cart)));
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    cartItemAdd: (state, { payload }) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === payload.id
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((item) =>
          item.id === existingItem.id ? payload : item
        );
      } else {
        state.cartItems = [...state.cartItems, payload];
      }
      state.loading = false;
      state.error = null;
      updateLocalStorage(state.cartItems);
      state.subtotal = Number(calculateSubtotal(state.cartItems));
    },
    cartItemRemoval: (state, { payload }) => {
      state.cartItems = [...state.cartItems].filter(
        (item) => item.id !== payload
      );
      updateLocalStorage(state.cartItems);
      state.subtotal = Number(calculateSubtotal(state.cartItems));
      state.loading = false;
      state.error = null;
    },
    setShippingCosts: (state, { payload }) => {
      state.shipping = payload;
      localStorage.setItem("shipping", payload);
    },
    clearCart: (state) => {
      localStorage.removeItem("subtotal");
      localStorage.removeItem("shipping");
      localStorage.removeItem("cartItems");
      state.subtotal = 0;
      state.shipping = Number(9.99);
      state.cartItems = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  cartItemAdd,
  cartItemRemoval,
  clearCart,
  setShippingCosts,
} = cartSlice.actions;

export default cartSlice.reducer;

export const cartSelector = (state) => state.cart;
