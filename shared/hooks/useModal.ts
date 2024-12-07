import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared"
import { useRef } from "react"
import { useDispatch } from "react-redux"
import {
	closeModal,
	pushModal,
	removeLastModal,
	setAddedChatsIds,
	setChatsLocale,
	setDeletedChatIds,
	setFolderManage,
	setFolderNameValue,
	setIconValue,
	setIsFetchModal,
} from "../lib/redux-store/slices/model-slice/modalSlice"
import {
	EnumModel,
	IModalData,
} from "../lib/redux-store/slices/model-slice/type"
import { useAppSelector } from "../lib/redux-store/store"

export const useModal = () => {
	const popoverRef = useRef<HTMLDivElement>(null)
	const { folderManage, stack: modalStack } = useAppSelector(
		state => state.modal
	)
	const dispatch = useDispatch()

	const onClose = () => {
		setTimeout(() => {
			dispatch(closeModal())
		}, 100)
	}

	const onCloseCurrentModal = (onFunc?: () => void) => {
		setTimeout(() => {
			dispatch(removeLastModal())
			if (onFunc) onFunc()
		}, 100)
	}

	const onOpenModal = (type: EnumModel, data?: IModalData) => {
		dispatch(
			pushModal({
				type,
				data,
			})
		)

		if (type === EnumModel.CREATE_FOLDER) {
			dispatch(setFolderManage())
		}
	}

	const onSetIsFetchModal = (value: boolean) => {
		dispatch(setIsFetchModal(value))
	}

	const currentModal = modalStack[modalStack.length - 1] || {
		type: null,
		data: null,
	}

	const isModalOpen = modalStack.length > 0

	const onIconValue = (icon: string) => dispatch(setIconValue(icon))
	const onFolderNameValue = (name: string) => dispatch(setFolderNameValue(name))
	const onChatsLocale = (chats: ICutChat[]) => dispatch(setChatsLocale(chats))
	const onAddedChatsIds = (ids: string[]) => dispatch(setAddedChatsIds(ids))
	const onDeletedChatsIds = (ids: string[]) => dispatch(setDeletedChatIds(ids))

	return {
		folderManage,
		modalStack,
		currentModal,
		isModalOpen,
		popoverRef,
		onClose,
		onOpenModal,
		onCloseCurrentModal,
		onSetIsFetchModal,
		onIconValue,
		onFolderNameValue,
		onChatsLocale,
		onAddedChatsIds,
		onDeletedChatsIds,
	}
}
