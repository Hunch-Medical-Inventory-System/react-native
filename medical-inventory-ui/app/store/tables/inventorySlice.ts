// store/inventorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readExpirableDataFromTable } from "../../utils/supabaseClient";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { DataFetchOptions, InventoryData, InventoryState } from "@/app/utils/types";


export const retrieveInventory = createAsyncThunk(
    "inventory/retrieveInventory",
    async (options: DataFetchOptions = { itemsPerPage: 100, page: 1, keywords: "" }) => {
        const data = await readExpirableDataFromTable("inventory", options);
        return data;
    }
);

const initialState: InventoryState = {
    inventoryLoading: true,
    inventoryError: "",
    currentInventory: { data: [], count: 0 },
    deletedInventory: { data: [], count: 0 },
    expiredInventory: { data: [], count: 0 },
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveInventory.pending, (state: InventoryState) => {
                state.inventoryLoading = true;
            })
            .addCase(retrieveInventory.fulfilled, (state: InventoryState, action: PayloadAction<InventoryState>) => {
                state.currentInventory = action.payload.currentData;
                state.deletedInventory = action.payload.deletedData;
                state.expiredInventory = action.payload.expiredData;
                state.inventoryLoading = false;
            })
            .addCase(retrieveInventory.rejected, (state) => {
                state.inventoryLoading = false;
            });
    },
});

export default inventorySlice.reducer;

