import { createSlice } from "@reduxjs/toolkit"

export type IUserSlice = {}

const initialState: IUserSlice = {}

export const userSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// setAge: (state, action: PayloadAction<IUserSlice["age"]>) => {
		// 	state.age = action.payload;
		// },
	},
})

export const {} = userSlice.actions
export const userReducer = userSlice.reducer
export type Type = IUserSlice
