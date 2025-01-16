// app/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import suppliesReducer from "./suppliesSlice";

export const store = configureStore({
  reducer: {
    counter: suppliesReducer,
  },
});

// Type exports for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
