import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readInventoryDataFromTable } from "@/app/utils/supabaseClient";
import type { DataFetchOptions, EntityState, InventoryData } from "@/app/utils/types";

// Async action for retrieving inventory data
export const retrieveInventory = createAsyncThunk(
  "inventory/retrieveInventory",
  async (options: DataFetchOptions) => {

    const data = await readInventoryDataFromTable(options);
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
        state.error = action.payload.data.error;
        state.current = action.payload.data.current;
        state.deleted = action.payload.data.deleted;
        state.expired = action.payload.data.expired;
      })
      .addCase(retrieveInventory.rejected, (state) => {
        state.loading = false;
      });   
  },
});

export default inventorySlice.reducer;