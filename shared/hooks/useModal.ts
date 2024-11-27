import { useRef } from "react"
import { useDispatch } from "react-redux"
import {
	closeModal,
	pushModal,
	removeLastModal,
	setIsFetchModal,
} from "../lib/redux-store/slices/model-slice/modalSlice"
import {
	EnumModel,
	IModalData,
} from "../lib/redux-store/slices/model-slice/type"
import { useAppSelector } from "../lib/redux-store/store"

export const useModal = () => {
	const popoverRef = useRef<HTMLDivElement>(null)
	const modalStack = useAppSelector(state => state.modal.stack)
	const dispatch = useDispatch()

	const onClose = () => {
		setTimeout(() => {
			dispatch(closeModal())
		}, 200)
	}

	const onCloseCurrentModal = (onFunc?: () => void) => {
		setTimeout(() => {
			dispatch(removeLastModal())
			if (onFunc) onFunc()
		}, 200)
	}

	const onOpenModal = (type: EnumModel, data?: IModalData) => {
		dispatch(
			pushModal({
				type,
				data,
			})
		)
	}

	const onSetIsFetchModal = (value: boolean) => {
		dispatch(setIsFetchModal(value))
	}

	const currentModal = modalStack[modalStack.length - 1] || {
		type: null,
		data: null,
	}

	const isModalOpen = modalStack.length > 0

	return {
		currentModal,
		isModalOpen,
		onClose,
		onOpenModal,
		onCloseCurrentModal,
		popoverRef,
		onSetIsFetchModal,
	}
}
