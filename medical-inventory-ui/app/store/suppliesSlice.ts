// redux/suppliesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readDeletableDataFromTable } from "../utils/supabaseClient";

// Async action for retrieving supplies
export const retrieveSupplies = createAsyncThunk(
  "supplies/retrieveSupplies",
  async (options) => {
    const data = await readDeletableDataFromTable("supplies", options);
    return data;
  }
);

const suppliesSlice = createSlice({
  name: "supplies",
  initialState: {
    currentSupplies: { data: [{}], count: 0 },
    deletedSupplies: { data: [{}], count: 0 },
    suppliesLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveSupplies.pending, (state) => {
        state.suppliesLoading = true;
      })
      .addCase(retrieveSupplies.fulfilled, (state, action) => {
        state.currentSupplies = action.payload.currentData;
        state.deletedSupplies = action.payload.deletedData;
        state.suppliesLoading = false;
      })
      .addCase(retrieveSupplies.rejected, (state) => {
        state.suppliesLoading = false;
      });
  },
});

export default suppliesSlice.reducer;
