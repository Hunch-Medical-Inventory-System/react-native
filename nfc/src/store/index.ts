import { configureStore } from "@reduxjs/toolkit";
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;