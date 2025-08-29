import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/carts");
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (lectureId, { rejectWithValue }) => {
    try {
      if (!lectureId || isNaN(lectureId)) {
        return rejectWithValue("Invalid lecture ID");
      }

      // Verify this matches your backend endpoint
      const response = await api.post("/carts/add", { lectureId });
      console.log("Add to cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Add to cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, { rejectWithValue }) => {
    try {
      if (!cartItemId) {
        console.error("Invalid cart item ID:", cartItemId);
        return rejectWithValue("Invalid cart item ID");
      }

      console.log(`Sending DELETE request to /carts/${cartItemId}`);
      const response = await api.delete(`/carts/${cartItemId}`);
      console.log("Remove from cart response:", response.data);

      // Return the ID for the reducer to use
      return cartItemId;
    } catch (error) {
      console.error("Remove from cart error:", error);
      console.error("Error response:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
    isEmpty: true,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.isEmpty = state.items.length === 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.isEmpty = true;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.isEmpty = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.id !== parseInt(action.payload)
        );
        state.isEmpty = state.items.length === 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

// Enhanced selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartIsEmpty = (state) => state.cart.isEmpty;
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + (item.Lecture?.price || 0),
    0
  );
export const selectCartItemCount = (state) => state.cart.items.length;

export default cartSlice.reducer;
