import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import inventoryReducer from "@/store/tables/inventorySlice";
import suppliesReducer from "@/store/tables/suppliesSlice";
import logsReducer from "@/store/tables/logsSlice";
import chatbotReducer from "@/store/chatbotSlice";

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    supplies: suppliesReducer,
    logs: logsReducer,
    chatbot: chatbotReducer,
  },
});

// Typed hooks for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
