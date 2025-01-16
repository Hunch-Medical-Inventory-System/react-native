// redux/crewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readDataFromTable } from "../utils/supabaseClient";

// Async action for retrieving crew data
export const retrieveCrew = createAsyncThunk(
  "crew/retrieveCrew",
  async (options) => {
    const data = await readDataFromTable("crew", options);
    return data;
  }
);

const crewSlice = createSlice({
  name: "crew",
  initialState: {
    currentCrew: { data: [{}], count: 0 },
    crewLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveCrew.pending, (state) => {
        state.crewLoading = true;
      })
      .addCase(retrieveCrew.fulfilled, (state, action) => {
        state.currentCrew = action.payload;
        state.crewLoading = false;
      })
      .addCase(retrieveCrew.rejected, (state) => {
        state.crewLoading = false;
      });
  },
});

export default crewSlice.reducer;
