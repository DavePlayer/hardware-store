import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "./../../config.json";
import { json } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { IUser } from "./user.js";

export interface IProduct {
    _id: string;
    nameAndCompany: String;
    date: String;
    rentedTo: string | null;
    beingRepaired?: boolean | null;
}
export interface IState {
    loading: boolean;
    data: Array<IProduct>;
}

const initialState: IState = { loading: true, data: [] };

export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    ({ token }: { token: string }) => {
        return fetch(`${config.serverUrl}/items`, {
            method: "GET",
            headers: { authorization: token },
        })
            .then(async (data) => {
                console.log(data);
                if (!data.ok) {
                    console.error(await data.json());
                    return [];
                } else {
                    return data.json();
                }
            })
            .then((json) => {
                return { items: json.items, token };
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    }
);

export const fetchRentedProducts = createAsyncThunk(
    "product/fetchRentedProducts",
    ({ token }: { token: string }) => {
        return fetch(`${config.serverUrl}/items`, {
            method: "GET",
            headers: { authorization: token },
        })
            .then(async (data) => {
                console.log(data);
                if (!data.ok) {
                    console.error(await data.json());
                    return [];
                } else {
                    return data.json();
                }
            })
            .then((json) => {
                return { items: json.items, token };
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    }
);

export const rentProduct = createAsyncThunk(
    "product/rentProduct",
    ({ token, itemId }: { token: string; itemId: string }) => {
        console.log(token, itemId);
        return fetch(`${config.serverUrl}/items/rent`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: token,
            },
            body: JSON.stringify({
                itemId: itemId,
            }),
        })
            .then(async (data) => {
                console.log(data);
                const json = await data.json();
                if (!data.ok) console.error(data);
                return json;
            })
            .then((json: { status: string; itemId: string }) => {
                return {
                    ...json,
                    token,
                };
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    }
);

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<IProduct>) => {
            state.data = [...state.data, action.payload];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            console.log("-----------------------", action.payload);
            const { items, token }: { items: IProduct[]; token: string } = action.payload;
            const userData: IUser = jwtDecode(token);
            state.data = items.filter((o) => o.rentedTo != userData._id);
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            console.error(action.error.message);
        });

        builder.addCase(rentProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(rentProduct.fulfilled, (state, action) => {
            state.loading = false;
            console.log("-----------------------", action.payload);
            const { itemId, token } = action.payload as undefined as {
                status: string;
                itemId: string;
                token: string;
            };
            const userData: IUser = jwtDecode(token);
            state.data = [...state.data.filter((o) => o._id != itemId)];
        });
        builder.addCase(rentProduct.rejected, (state, action) => {
            console.error(action.error.message);
        });
    },
});

// Action creators are generated for each case reducer function
export const { add } = productsSlice.actions;

export default productsSlice.reducer;
