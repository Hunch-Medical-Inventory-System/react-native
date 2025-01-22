import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import inventoryReducer from "./tables/inventorySlice";
import suppliesReducer from "./tables/suppliesSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    inventory: inventoryReducer,
    supplies: suppliesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
