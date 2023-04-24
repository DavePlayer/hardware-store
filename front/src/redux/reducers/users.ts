import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config.json";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "./user.js";

export interface IUser {
    _id: string;
    login: string;
    isAdmin: boolean;
    userName: string;
}

interface IUpdate {
    _id: string;
    login?: string;
    isAdmin?: boolean;
    userName?: string;
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

export const updateUser = createAsyncThunk(
    "user/updateuser",
    ({ token, user }: { token: string; user: IUpdate }) => {
        return fetch(`${config.serverUrl}/register/update`, {
            method: "POST",
            headers: { authorization: token, "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify(user),
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
                return { ...data };
            });
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    ({ token, _id }: { token: string; _id: string }) => {
        return fetch(`${config.serverUrl}/user`, {
            method: "DELETE",
            headers: { authorization: token, "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify({ _id }),
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
                return { ...data };
            });
    }
);

export const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ------------------
        // fetch all users
        // -----------------

        // pending
        builder.addCase(fetchAllUsers.pending, (state, action) => {
            console.log("awaiting");
        });

        // fulfilled
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            const { jwt, users } = action.payload as undefined as {
                jwt: IUser;
                users: Array<IUser>;
            };
            const newUsers = users.filter((o) => o._id != jwt._id);
            return newUsers;
        });

        // error
        builder.addCase(fetchAllUsers.rejected, (state, action) => {
            console.error(action.error);
            toast.error(`error when getting all users: ${action.error.message}`);
        });

        // ------------------
        // update user
        // -----------------

        // pending
        builder.addCase(updateUser.pending, (state, action) => {
            console.log("awaiting");
        });

        // fulfilled
        builder.addCase(updateUser.fulfilled, (state, action) => {
            const { user } = action.payload as undefined as { user: IUser };
            toast.info(`updated ${user.userName}`);
            const newState = state.map((o) => (o._id == user._id ? user : o));
            return newState;
        });

        // error
        builder.addCase(updateUser.rejected, (state, action) => {
            console.error(action.error);
            toast.error(`error when getting all users: ${action.error.message}`);
        });

        // ------------------
        // delete user
        // -----------------

        // pending
        builder.addCase(deleteUser.pending, (state, action) => {
            console.log("awaiting");
        });

        // fulfilled
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            const { _id } = action.payload as undefined as { _id: string };
            toast.info(`removed user`);
            const newState = state.filter((o) => o._id != _id);
            return newState;
        });

        // error
        builder.addCase(deleteUser.rejected, (state, action) => {
            console.error(action.error);
            toast.error(`error when getting all users: ${action.error.message}`);
        });
    },
});

// Action creators are generated for each case reducer function
// export const { readToken, logout } = usersSlice.actions;

export default usersSlice.reducer;
