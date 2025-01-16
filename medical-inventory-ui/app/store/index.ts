// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./inventorySlice";
import suppliesReducer from "./suppliesSlice";
import crewReducer from "./crewSlice";
import logsReducer from "./logsSlice";

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    supplies: suppliesReducer,
    crew: crewReducer,
    logs: logsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Export RootState

export default store;
