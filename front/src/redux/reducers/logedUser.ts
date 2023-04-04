
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { config } from "../../config";

interface IUser {
  id: number,
  username: String,
}
interface ILogedUser {
  logedIn: boolean,
  token: String | null
  user: IUser | null
}

const initialState: ILogedUser = {
  logedIn: true,
  token: null,
  user: null
}

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<String>) => {
      fetch(`${config.serverURL}/verifyToken`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': '',
          "Authorization": action.payload as string
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.status == "OK") {
            initialState.logedIn = true;
            initialState.token = res.token,
              initialState.user = res.user
          }
        })
    },
  },
});

// Action creators are generated for each case reducer function
export const { login } = productsSlice.actions;

export default productsSlice.reducer;
