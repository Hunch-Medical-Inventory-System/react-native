import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readDataFromTable } from "@/app/utils/supabaseClient";
import type {
  DataFetchOptions,
  EntityState,
  CrewData,
} from "@/app/utils/types";

// Async action for retrieving inventory data
export const retrieveCrew = createAsyncThunk(
  "inventory/retrieveInventory",
  async (options: DataFetchOptions) => {
    const data = await readDataFromTable("crew", options);
    return data;
  }
);

const initialState: EntityState<CrewData> = {
  loading: true,
  error: null,
  current: { data: [], count: 0 },
};

const crewSlice = createSlice({
  name: "crew",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveCrew.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveCrew.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.current = action.payload.current;
      })
      .addCase(retrieveCrew.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default crewSlice.reducer;