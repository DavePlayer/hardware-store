import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IProduct {
  id: number;
  nameAndCompany: String;
  date: String;
  rentedTo: number | null;
  beingRepaired?: boolean | null;
}

const initialState: Array<IProduct> = [
  {
    id: 1,
    nameAndCompany: "Apple Iphone 12",
    date: "23-12-2022",
    rentedTo: null,
  },
  {
    id: 2,
    nameAndCompany: "Apple Iphone 14",
    date: "23-12-2024",
    rentedTo: null,
    beingRepaired: true,
  },
  {
    id: 3,
    nameAndCompany: "Apple Iphone 13",
    date: "23-12-2022",
    rentedTo: 12,
  },
  {
    id: 4,
    nameAndCompany: "Apple Iphone 14",
    date: "12-12-2021",
    rentedTo: null,
  },
  {
    id: 5,
    nameAndCompany: "Apple Iphone 19",
    date: "10-12-2022",
    rentedTo: null,
  },
];

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<IProduct>) => {
      state = [...state, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { add } = productsSlice.actions;

export default productsSlice.reducer;
