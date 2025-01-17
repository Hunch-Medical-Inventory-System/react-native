// // redux/logsSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { readDataFromTable } from "../../utils/supabaseClient";

// // Async action for retrieving logs
// export const retrieveLogs = createAsyncThunk(
//   "logs/retrieveLogs",
//   async (options) => {
//     const data = await readDataFromTable("logs", options);
//     return data;
//   }
// );

// const logsSlice = createSlice({
//   name: "logs",
//   initialState: {
//     currentLogs: { data: [{}], count: 0 },
//     logsLoading: true,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(retrieveLogs.pending, (state) => {
//         state.logsLoading = true;
//       })
//       .addCase(retrieveLogs.fulfilled, (state, action) => {
//         state.currentLogs = action.payload;
//         state.logsLoading = false;
//       })
//       .addCase(retrieveLogs.rejected, (state) => {
//         state.logsLoading = false;
//       });
//   },
// });

// export default logsSlice.reducer;
