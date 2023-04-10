import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import productsReducer from "./reducers/product";
import logger from "redux-logger";
import userReducer from "./reducers/user.js";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
