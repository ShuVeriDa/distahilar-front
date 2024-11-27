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
		setIsFetchModal: (state, action: PayloadAction<boolean>) => {
			const lastModal = state.stack[state.stack.length - 1]
			if (lastModal.data && lastModal.data.folderEdit) {
				lastModal.data.folderEdit.isFetching = action.payload
			}
		},
	},
})

export const { removeLastModal, pushModal, closeModal, setIsFetchModal } =
	modalSlice.actions
export const modalReducer = modalSlice.reducer
export type Type = IModelSlice
