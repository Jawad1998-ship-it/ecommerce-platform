import { InitialStateTypes } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  currentUser: {},
  cartItems: {},
  loading: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<object>) => {
      state.currentUser = action.payload;
    },
    addToCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.cartItems[productId] = (state.cartItems[productId] || 0) + 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const newQuantity = (state.cartItems[productId] || 0) - 1;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = state.cartItems;
        state.cartItems = rest;
      } else {
        state.cartItems[productId] = newQuantity;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setCurrentUser,
  addToCart,
  removeFromCart,
  setLoading,
} = globalSlice.actions;
export default globalSlice.reducer;
