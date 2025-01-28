import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readDeletableDataFromTable } from "@/utils/supabaseClient";
import type { DataFetchOptions } from "@/types";
import type { EntityState, SuppliesData } from "@/types/tables";

// Async action for retrieving supplies data
export const retrieveSupplies = createAsyncThunk(
  "supplies/retrieveSupplies",
  async (options: DataFetchOptions) => {
    const data = await readDeletableDataFromTable("supplies", options);
    return data;
  }
);

const initialState: EntityState<SuppliesData> = {
  loading: true,
  error: null,
  current: { data: [], count: 0 },
};

const suppliesSlice = createSlice({
  name: "supplies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveSupplies.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveSupplies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.current = action.payload.current;
      })
      .addCase(retrieveSupplies.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default suppliesSlice.reducer;
