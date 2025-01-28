import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readExpirableDataFromTable } from "@/utils/supabaseClient";
import type { DataFetchOptions } from "@/types";
import type { EntityState, InventoryData } from '@/types/tables'; 

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

export const addInventory = createAsyncThunk(
  'inventory/addInventory',
  async (newItem: InventoryData, { dispatch }) => {
    // API call to add the item
  }
);

export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async (updatedItem: InventoryData, { dispatch }) => {
    // API call to update the item
  }
);

export const deleteInventory = createAsyncThunk(
  'inventory/deleteInventory',
  async (itemId: number, { dispatch }) => {
    // API call to delete the item
  }
);

export default inventorySlice.reducer; addInventory; updateInventory; deleteInventory;