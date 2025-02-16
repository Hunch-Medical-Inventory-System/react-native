import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import inventoryReducer from "./tables/inventorySlice";
import suppliesReducer from "./tables/suppliesSlice";
import crewReducer from "./tables/crewSlice";
import logsReducer from "./tables/logsSlice";

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    supplies: suppliesReducer,
    crew: crewReducer,
    logs: logsReducer,
  },
});

// Typed hooks for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
