import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import productsReducer from "./reducers/product";
import logger from "redux-logger";
import userReducer from "./reducers/user.js";
import usersReducer from "./reducers/users.js";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        user: userReducer,
        users: usersReducer,
    },
    // middleware used to display state static/async state changes
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
