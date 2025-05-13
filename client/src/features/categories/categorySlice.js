import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl = import.meta.env.VITE_API_BASE_URL;
export const categorySlice = createSlice({
  name: "category",
  initialState: {
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      console.log(action.payload, "<< ap");
      state.list = action.payload.data;
    });
    builder.addCase(fetchCategories.pending, () => {
      console.log("Fetching categoris...");
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      console.error("Error fetching categories:", action.error);
    });
  },
});

export const { setCategories } = categorySlice.actions;

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const { data } = await axios.get(`${serverUrl}/categories`);
    return data;
  }
);

export default categorySlice.reducer;
