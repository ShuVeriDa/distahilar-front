import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import { EnumModel, IModalData, IModelSlice } from "./type"

const initialState: IModelSlice = {
	stack: [
		{
			type: null,
			priority: 0,
			data: null,
		},
	],
	folderManage: {
		folderNameValue: "",
		iconValue: "Folder",
		chatsLocale: [],
		addedChatsIds: [],
		deletedChatIds: [],
	},
}

export const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		pushModal: (
			state,
			action: PayloadAction<{ type: EnumModel; data?: IModalData | null }>
		) => {
			const newModal = {
				type: action.payload.type,
				data: action.payload.data !== undefined ? action.payload.data : null,
				priority: state.stack.length,
			}
			state.stack.push(newModal)
		},
		closeModal: state => {
			state.stack = []
		},
		removeLastModal: state => {
			state.stack.pop()
		},
		setFolderManage: state => {
			const folderManage = {
				addedChatsIds: [],
				chatsLocale: [],
				deletedChatIds: [],
				folderNameValue: "",
				iconValue: "Folder",
			}

			state.folderManage = folderManage
		},
		setIsFetchModal: (state, action: PayloadAction<boolean>) => {
			const lastModal = state.stack[state.stack.length - 1]
			if (lastModal.data && lastModal.data.folderManage) {
				lastModal.data.folderManage.isFetching = action.payload
			}
		},
		setFolderNameValue: (state, action: PayloadAction<string>) => {
			if (state.folderManage) {
				state.folderManage.folderNameValue = action.payload
			}
		},
		setIconValue: (state, action: PayloadAction<string>) => {
			if (state.folderManage) {
				state.folderManage.iconValue = action.payload
			}
		},
		setChatsLocale: (state, action: PayloadAction<ICutChat[]>) => {
			if (state.folderManage) {
				state.folderManage.chatsLocale = action.payload
			}
		},
		setAddedChatsIds: (state, action: PayloadAction<string[]>) => {
			if (state.folderManage) {
				state.folderManage.addedChatsIds = action.payload
			}
		},
		setDeletedChatIds: (state, action: PayloadAction<string[]>) => {
			if (state.folderManage) {
				state.folderManage.deletedChatIds = action.payload
			}
		},
	},
})

export const {
	removeLastModal,
	pushModal,
	closeModal,
	setIsFetchModal,
	setFolderNameValue,
	setChatsLocale,
	setAddedChatsIds,
	setDeletedChatIds,
	setIconValue,
	setFolderManage,
} = modalSlice.actions
export const modalReducer = modalSlice.reducer
export type Type = IModelSlice
