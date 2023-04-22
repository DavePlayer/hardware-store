import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config.json";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface IUser {
    _id: string;
    login: string;
    isAdmin: boolean;
    userName: string;
}

const initialState: Array<IUser> = [];

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    ({ token }: { token: string }) => {
        return fetch(`${config.serverUrl}/login/get-all-users`, {
            method: "GET",
            headers: { authorization: token, "Content-Type": "application/json;charset=utf-8" },
        })
            .then(async (data) => {
                if (data.ok) {
                    return data.json();
                } else {
                    try {
                        const json = await data.json();
                        throw await new Error(json.status);
                    } catch (err) {
                        throw err;
                    }
                }
            })
            .then((data) => {
                const jwt: IUser = jwtDecode(token);
                return { jwt: jwt, ...data };
            });
    }
);

export const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllUsers.pending, (state, action) => {
            console.log("awaiting");
        });
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            const { jwt, users } = action.payload as undefined as {
                jwt: string;
                users: Array<IUser>;
            };
            return users;
        });
        builder.addCase(fetchAllUsers.rejected, (state, action) => {
            console.error(action.error);
            toast.error(`error when getting all users: ${action.error.message}`);
        });
    },
});

// Action creators are generated for each case reducer function
// export const { readToken, logout } = usersSlice.actions;

export default usersSlice.reducer;
