import { UserType } from "@/prisma/models"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type IUserSlice = {
	user: UserType | null
}

const initialState: IUserSlice = {
	user: null,
}

export const userSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUserSlice["user"]>) => {
			state.user = action.payload
		},
	},
})

export const { setUser } = userSlice.actions
export const userReducer = userSlice.reducer
export type Type = IUserSlice
