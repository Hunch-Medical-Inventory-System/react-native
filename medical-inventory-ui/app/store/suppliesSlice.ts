// app/store/suppliesSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const suppliesSlice = createSlice({
  name: "supplies",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = suppliesSlice.actions;
export default suppliesSlice.reducer;
