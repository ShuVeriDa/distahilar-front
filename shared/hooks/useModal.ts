import { useDispatch } from "react-redux"
import {
	setCloseModal,
	setOpenModal,
} from "../lib/redux-store/slices/model-slice/modalSlice"
import {
	IModalData,
	ModelType,
} from "../lib/redux-store/slices/model-slice/type"
import { useAppSelector } from "../lib/redux-store/store"

export const useModal = () => {
	const modalData = useAppSelector(state => state.modal)

	const dispatch = useDispatch()

	const onClose = () => {
		setTimeout(() => {
			dispatch(setCloseModal())
		}, 200)
	}

	const onOpenModal = (type: ModelType, data?: IModalData) => {
		dispatch(
			setOpenModal({
				isOpen: true,
				type: type!,
				data: data,
			})
		)
	}

	return { modalData, onClose, onOpenModal }
}
