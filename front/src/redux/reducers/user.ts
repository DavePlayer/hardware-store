import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "./../../config.json";
import jwtDecode from "jwt-decode";

export interface IUser {
    _id: string;
    isAdmin: boolean;
    userName: string;
    isLoged: boolean;
    jwt: string;
    loading: boolean;
}

const initialState: IUser = {
    loading: true,
    _id: "",
    isAdmin: false,
    userName: "super hacka",
    isLoged: false,
    jwt: "",
};

export const fetchLogin = createAsyncThunk(
    "user/fetchLogin",
    ({ login, password }: { login: string; password: string }) => {
        return fetch(`${config.serverUrl}/login?${new URLSearchParams({ login, password })}`, {
            method: "GET",
            headers: { "Content-type": "application/json;charset=utf-8" },
        })
            .then(async (data) => (data.ok ? data.json() : console.error(await data.json())))
            .then((o) => {
                const data: IUser = jwtDecode(o.token);
                return { jwt: o.token, ...data };
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        readToken: (state, action) => {
            const { token }: { token: string } = action.payload;
            const data: IUser = jwtDecode(token);
            console.log(`----------------------------`, data);
            state._id = data._id;
            state.isAdmin = data.isAdmin;
            state.isLoged = true;
            state.jwt = token;
            state.userName = data.userName;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLogin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            state.loading = false;
            state._id = (action.payload as unknown as IUser)._id;
            state.isAdmin = (action.payload as unknown as IUser).isAdmin;
            state.isLoged = true;
            state.jwt = (action.payload as unknown as IUser).jwt;
            state.userName = (action.payload as unknown as IUser).userName;
            localStorage.setItem("token", state.jwt);
        });
        builder.addCase(fetchLogin.rejected, (state, action) => {
            console.error(action.error.message);
        });
    },
});

// Action creators are generated for each case reducer function
export const { readToken } = userSlice.actions;

export default userSlice.reducer;
