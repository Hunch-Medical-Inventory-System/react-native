import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabaseController from "@/utils/supabaseClient";
import type {
  DataFetchOptions,
  EntityState,
  LogsData,
} from "@/types/tables";

// Async action for retrieving inventory data
export const retrieveCrew = createAsyncThunk(
  "inventory/retrieveInventory",
  async (options: DataFetchOptions) => {
    const data = await supabaseController.readDataFromTable("logs", options);
    return data;
  }
);

const initialState: EntityState<LogsData> = {
  loading: true,
  error: null,
  active: { data: [], count: 0 },
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
        state.active = action.payload.active;
      })
      .addCase(retrieveCrew.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default crewSlice.reducer;
