import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "./../../config.json";
import { json } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { IUser } from "./user.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                if (!data.ok) {
                    console.error(await data.json());
                    return [];
                } else {
                    return data.json();
                }
            })
            .then((json) => {
                return { items: json.items, token };
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
                if (!data.ok) {
                    console.error(await data.json());
                    return [];
                } else {
                    return data.json();
                }
            })
            .then((json) => {
                return { items: json.items, token };
            });
    }
);

export const rentProduct = createAsyncThunk(
    "product/rentProduct",
    ({ token, itemId }: { token: string; itemId: string }) => {
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
                const json = await data.json();
                if (!data.ok) console.error(data);
                return json;
            })
            .then((json: { status: string; itemId: string }) => {
                return {
                    ...json,
                    token,
                };
            });
    }
);

export const returnProduct = createAsyncThunk(
    "product/returnProduct",
    ({ token, itemId }: { token: string; itemId: string }) => {
        return fetch(`${config.serverUrl}/items/release`, {
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
                const json = await data.json();
                if (!data.ok) console.error(data);
                return json;
            })
            .then((json: { status: string; itemId: string }) => {
                return {
                    ...json,
                    token,
                };
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
        // ------------------
        // fetch products
        // -----------------

        // pending
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        });

        // fulfilled
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            const { items, token }: { items: IProduct[]; token: string } = action.payload;
            const userData: IUser = jwtDecode(token);
            state.data = items.filter((o) => o.rentedTo != userData._id);
        });

        // rejected
        builder.addCase(fetchProducts.rejected, (state, action) => {
            console.error(action.error.message);
        });

        // ------------------
        // fetch rented products
        // -----------------

        // pending
        builder.addCase(fetchRentedProducts.pending, (state) => {
            state.loading = true;
        });

        // fulfilled
        builder.addCase(fetchRentedProducts.fulfilled, (state, action) => {
            state.loading = false;
            const { items, token }: { items: IProduct[]; token: string } = action.payload;
            const userData: IUser = jwtDecode(token);
            state.data = items.filter((o) => o.rentedTo == userData._id);
        });

        // rejected
        builder.addCase(fetchRentedProducts.rejected, (state, action) => {
            console.error(action.error.message);
        });

        // -------------------
        // rent product
        // -------------------

        // pending
        builder.addCase(rentProduct.pending, (state) => {
            state.loading = true;
        });

        // fulfilled
        builder.addCase(rentProduct.fulfilled, (state, action) => {
            state.loading = false;
            const { itemId, token } = action.payload as undefined as {
                status: string;
                itemId: string;
                token: string;
            };
            const userData: IUser = jwtDecode(token);
            state.data = [...state.data.filter((o) => o._id != itemId)];
            toast.success("successfully rented new product");
        });

        // error
        builder.addCase(rentProduct.rejected, (state, action) => {
            console.error(action.error.message);
            toast.error(`error when renting product: ${action.error.message}`);
        });

        // -------------------
        // return product
        // -------------------

        // pending
        builder.addCase(returnProduct.pending, (state) => {
            state.loading = true;
        });

        // fulfilled
        builder.addCase(returnProduct.fulfilled, (state, action) => {
            state.loading = false;
            const { status, itemId, token }: { status: string; itemId: string; token: string } =
                action.payload;
            state.data = [...state.data.filter((o) => o._id != itemId)];
            toast.success("successfully returned new product");
        });

        // error
        builder.addCase(returnProduct.rejected, (state, action) => {
            console.error(action.error.message);
            toast.error(`error when returning product: ${action.error.message}`);
        });
    },
});

// Action creators are generated for each case reducer function
export const { add } = productsSlice.actions;

export default productsSlice.reducer;
