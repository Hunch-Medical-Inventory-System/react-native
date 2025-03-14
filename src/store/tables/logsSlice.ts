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
