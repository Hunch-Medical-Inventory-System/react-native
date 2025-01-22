import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readExpirableDataFromTable } from "@/app/utils/supabaseClient";
import type { DataFetchOptions, EntityState, InventoryData } from "@/app/utils/types";

// Async action for retrieving inventory data
export const retrieveInventory = createAsyncThunk(
  "inventory/retrieveInventory",
  async (options: DataFetchOptions) => {

    const data = await readExpirableDataFromTable("inventory", options);
    return data;
    
  }
);

const initialState: EntityState<InventoryData> = {
  loading: true,
  error: null,
  current: { data: [], count: 0 },
  deleted: { data: [], count: 0 },
  expired: { data: [], count: 0 },
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.current = action.payload.current;
        state.deleted = action.payload.deleted;
        state.expired = action.payload.expired;
      })
      .addCase(retrieveInventory.rejected, (state) => {
        state.loading = false;
      });   
  },
});

export default inventorySlice.reducer;