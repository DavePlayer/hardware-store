import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "./../../config.json";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface IUser {
    _id: string;
    isAdmin: boolean;
    userName: string;
    isLoged: boolean;
    jwt: string;
    loading: boolean;
    imgPath: string | null;
}

const initialState: IUser = {
    loading: true,
    _id: "",
    isAdmin: false,
    userName: "super hacka",
    isLoged: false,
    jwt: "",
    imgPath: null,
};

export const fetchLogin = createAsyncThunk(
    "user/fetchLogin",
    ({ login, password }: { login: string; password: string }) => {
        return fetch(`${config.serverUrl}/login?${new URLSearchParams({ login, password })}`, {
            method: "GET",
            headers: { "Content-type": "application/json;charset=utf-8" },
        })
            .then(async (data) => {
                if (data.ok) {
                    return data.json();
                } else throw await new Error((await data.json()).status);
            })
            .then((o) => {
                const data: IUser = jwtDecode(o.token);
                return { jwt: o.token, ...data };
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
            state._id = data._id;
            state.isAdmin = data.isAdmin;
            state.isLoged = true;
            state.jwt = token;
            state.userName = data.userName;
            state.imgPath = data.imgPath;
        },
        logout: (state) => {
            console.log(`loging out`);
            localStorage.removeItem("token");
            return (state = {
                loading: false,
                _id: "",
                isAdmin: false,
                userName: "super hacka",
                isLoged: false,
                jwt: "",
                imgPath: null,
            });
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
            state.imgPath = (action.payload as unknown as IUser).imgPath;
            localStorage.setItem("token", state.jwt);
        });
        builder.addCase(fetchLogin.rejected, (state, action) => {
            console.error(action.error.message);
            toast.error(action.error.message);
        });
    },
});

// Action creators are generated for each case reducer function
export const { readToken, logout } = userSlice.actions;

export default userSlice.reducer;
