import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabaseController from "@/utils/supabaseClient";
import type { DataFetchOptions, ExpirableEntityState, InventoryData } from "@/types/tables";

const initialState: ExpirableEntityState<InventoryData> = {
  loading: true,
  error: null,
  active: { data: [], count: 0 },
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
        state.active = action.payload.active;
        state.expired = action.payload.expired;
      })
      .addCase(retrieveInventory.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Async action for retrieving inventory data
export const retrieveInventory = createAsyncThunk(
  "inventory/retrieveInventory",
  async (options: DataFetchOptions) => {

    const data = await supabaseController.readExpirableDataFromTable("inventory", options, ["id", "created_at", "quantity", "expiry_date", "supplies(name)"]);
    return data;

  }
);

export const fetchInventoryData = createAsyncThunk(
  "inventory/fetchData",
  async (ids: number[]) => {
    const data = await supabaseController.readRowsFromTable<"inventory">("inventory", "id", ids); // Replace "inventory" with your actual table name
    if (!data) {
      throw new Error("Inventory data not found");
    }
    return data;
  }
);

export const addInventory = createAsyncThunk<
  // Return type of the fulfilled action (ID of the new item)
  number,
  // Argument type (InventoryData)
  Partial<InventoryData>,
  {
    rejectValue: string; // Reject type for error messages
  }
>(
  "inventory/addInventory",
  async (newItem: Partial<InventoryData>, { rejectWithValue }) => {
    try {
      const result = await supabaseController.AddRowInTable("inventory", newItem);

      if (typeof result === "string") {
        // If it's a string (error), reject the promise with the error message
        return rejectWithValue(result);
      }

      // Return the id if successful (adjust as needed)
      return result; // Assuming result is the ID
    } catch (error) {
      console.error("Error in addInventory thunk:", error);
      return rejectWithValue("An error occurred while adding inventory.");
    }
  }
);

export const updateInventory = createAsyncThunk<
  boolean, // The return type is boolean (success/failure)
  { id: number; data: Partial<InventoryData> }, // The arguments this thunk will receive
  { rejectValue: string } // The type of the error we will handle
>(
  "inventory/updateInventory", // The action type string
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Call the update function from supabaseClient
      const result = await supabaseController.updateRowInTable("inventory", id, data);
      if (!result) {
        throw new Error("Failed to update the inventory data.");
      }
      return result; // Return true on success
    } catch (error: any) {
      console.error("Error updating inventory:", error.message);
      return rejectWithValue(error.message); // Return the error message to be handled in reducers
    }
  }
);

export const deleteInventory = createAsyncThunk(
  'inventory/deleteInventory',
  async (itemId: number, { dispatch }) => {
    // API call to delete the item
  }
);

export default inventorySlice.reducer; addInventory; updateInventory; deleteInventory;