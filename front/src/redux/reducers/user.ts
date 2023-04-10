import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "./../../config.json";

export interface IProduct {
    token: string;
}

const initialState = {
    token: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ login: string; password: string }>) => {
            const { login, password } = action.payload;
            console.log("---------------------------", login, password);
            fetch(`${config.serverUrl}/login?${new URLSearchParams({ login, password })}`, {
                method: "GET",
                headers: { "Content-type": "application/json;charset=utf-8" },
            })
                .then(async (data) => (data.ok ? data.json() : console.error(await data.json())))
                .then((token) => console.log("token: ", token))
                .catch((err) => {
                    console.error(err);
                });
            return state;
        },
    },
});

// Action creators are generated for each case reducer function
export const { login } = userSlice.actions;

export default userSlice.reducer;
