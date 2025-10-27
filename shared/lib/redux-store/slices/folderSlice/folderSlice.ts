import { FolderType } from "@/prisma/models"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type IFolderSlice = {
	folder: FolderType | null
	name: "All chats" | string
}

const initialState: IFolderSlice = {
	folder: null,
	name: "All chats",
}

export const folderSlice = createSlice({
	name: "folder",
	initialState,
	reducers: {
		setFolder: (state, action: PayloadAction<IFolderSlice>) => {
			state.folder = action.payload.folder
			state.name = action.payload.name
		},
	},
})

export const { setFolder } = folderSlice.actions
export const folderReducer = folderSlice.reducer
export type Type = IFolderSlice
