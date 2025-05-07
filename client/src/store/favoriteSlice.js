import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:3000/favorites", {
        headers: { access_token: token },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data favorit"
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const favoriteResponse = await axios.get(
        "http://localhost:3000/favorites",
        {
          headers: { access_token: token },
        }
      );
      const isFavorite = favoriteResponse.data.some(
        (fav) => fav.id === Number(id)
      );

      if (isFavorite) {
        await axios.delete(`http://localhost:3000/favorites/${id}`, {
          headers: { access_token: token },
        });
        return { id: Number(id), action: "remove" };
      } else {
        await axios.post(
          `http://localhost:3000/favorites/${id}`,
          {},
          {
            headers: { access_token: token },
          }
        );
        const response = await axios.get(
          `http://localhost:3000/public/devices/${id}`,
          {
            headers: { access_token: token },
          }
        );
        return { id: Number(id), action: "add", device: response.data };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal memperbarui status favorit"
      );
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.action === "remove") {
          state.favorites = state.favorites.filter(
            (fav) => fav.id !== action.payload.id
          );
        } else {
          state.favorites.push(action.payload.device);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = favoriteSlice.actions;
export default favoriteSlice.reducer;
