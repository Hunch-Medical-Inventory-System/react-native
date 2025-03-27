import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabaseController from "@/utils/supabaseClient";
import type {
  DataFetchOptions,
  LogsData,
  PersonalEntityState,
} from "@/types/tables";

// Async action for retrieving inventory data
export const retrieveLogs = createAsyncThunk(
  "logs/retrieveLogs",
  async (options: DataFetchOptions) => {
    const data = await supabaseController.readPersonalDataFromTable("logs", options, ["id", "created_at", "inventory(supplies(name))", "crew(first_name, last_name)", "quantity"]);
    return data;
  }
);

// export const addLog = createAsyncThunk<
//   // Return type of the fulfilled action (ID of the new item)
//   number,
//   // Argument type (InventoryData)
//   Partial<LogsData>,
//   { rejectValue: string }
// >(
//   "logs/addLog",
//   async (newItem: Partial<LogsData>, { rejectWithValue }) => {
//     try {
//       const result = await supabaseController.AddRowInTable("logs", newItem);

//       if (typeof result === "string") {
//         // If it's a string (error), reject the promise with the error message
//         return rejectWithValue(result);
//       }

//       // Return the id if successful (adjust as needed)
//       return result; // Assuming result is the ID
//     } catch (error) {
//       console.error("Error in addLog thunk:", error);
//       return rejectWithValue("An error occurred while adding log.");
//     }
//   }
// )

const initialState: PersonalEntityState<LogsData> = {
  loading: true,
  error: null,
  active: { data: [], count: 0 },
  personal: { data: [], count: 0 },
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.active = action.payload.active;
        state.personal = action.payload.personal;
      })
      .addCase(retrieveLogs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default logsSlice.reducer;
