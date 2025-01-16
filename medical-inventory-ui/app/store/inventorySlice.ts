// store/inventorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readExpirableDataFromTable } from "../utils/supabaseClient";

// AsyncThunk for fetching inventory
export const retrieveInventory = createAsyncThunk(
  "inventory/fetchData",
  async (
    options: { itemsPerPage: number; page: number; keywords: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await readExpirableDataFromTable("inventory", options);
      return data; // returns the data if successful
    } catch (error) {
      return rejectWithValue(error); // returns error if fails
    }
  }
);

interface InventoryState {
  currentInventory: { data: any[]; count: number };
  deletedInventory: { data: any[]; count: number };
  expiredInventory: { data: any[]; count: number };
  inventoryLoading: boolean;
}

const initialState: InventoryState = {
  currentInventory: { data: [], count: 0 },
  deletedInventory: { data: [], count: 0 },
  expiredInventory: { data: [], count: 0 },
  inventoryLoading: false,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveInventory.pending, (state) => {
        state.inventoryLoading = true;
      })
      .addCase(retrieveInventory.fulfilled, (state, action) => {
        state.inventoryLoading = false;
        state.currentInventory = action.payload.currentData;
        state.deletedInventory = action.payload.deletedData;
        state.expiredInventory = action.payload.expiredData;
      })
      .addCase(retrieveInventory.rejected, (state) => {
        state.inventoryLoading = false;
      });
  },
});

export default inventorySlice.reducer;
