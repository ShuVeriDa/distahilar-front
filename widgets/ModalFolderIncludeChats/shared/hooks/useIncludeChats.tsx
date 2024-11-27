import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { useChatQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useEffect, useState } from "react"
import { ICutChat } from "../types/types.type"

export const useIncludeChats = () => {
	//useModal things
	const { onCloseCurrentModal, currentModal, isModalOpen } = useModal()
	const { type, data } = currentModal
	const chats = data?.includeChats?.chats
	const onAddChatsIds = data?.includeChats?.onAddChatsIds
	const onRemoveChatsIds = data?.includeChats?.onRemoveChatsIds

	const isCurrentModal = isModalOpen && type === EnumModel.INCLUDE_CHATS

	//useIncludeChats things

	const [includedChats, setIncludedChats] = useState<ICutChat[] | []>([])

	const [addedChatsIdsLocale, setAddedChatsIdsLocale] = useState<string[]>([])
	const [removedChatsIdsLocale, setRemovedChatsIdsLocale] = useState<string[]>(
		[]
	)

	const { fetchChatsQuery } = useChatQuery()
	const { data: localChats, isLoading } = fetchChatsQuery

	const addChat = (chat: ICutChat) => {
		setIncludedChats(prev => [...prev, chat])

		const isIncluded = chats?.find(c => c.chatId === chat.chatId)

		if (!isIncluded) {
			setAddedChatsIdsLocale(prev => [...prev, chat.chatId])
		}

		setRemovedChatsIdsLocale(prev => prev.filter(id => id !== chat.chatId))
	}

	const removeChat = (chatId: string) => {
		setIncludedChats(prev => prev.filter(chat => chat.chatId !== chatId))

		const isIncluded = chats?.find(chat => chat.chatId === chatId)

		if (isIncluded) {
			setRemovedChatsIdsLocale(prev => [...prev, chatId])
		}

		setAddedChatsIdsLocale(prev => prev.filter(id => id !== chatId))
	}

	const onChatRemoveOrAdd = (chat: ICutChat) => {
		const isIncluded = includedChats
			.map(chat => chat.chatId)
			.includes(chat.chatId)

		if (isIncluded) {
			removeChat(chat.chatId)
		} else {
			addChat(chat)
		}
	}

	const onReset = () => {
		setIncludedChats([])
		setRemovedChatsIdsLocale([])
		setAddedChatsIdsLocale([])
	}

	const onSave = async () => {
		if (removedChatsIdsLocale && onRemoveChatsIds) {
			onRemoveChatsIds(removedChatsIdsLocale)
		}
		if (addedChatsIdsLocale && onAddChatsIds) {
			onAddChatsIds(includedChats, addedChatsIdsLocale)
		}

		onCloseCurrentModal(onReset)
	}

	useEffect(() => {
		if (chats) {
			setIncludedChats(chats)
		}
	}, [chats])

	useEffect(() => {
		if (!isModalOpen) {
			onReset()
		}
	}, [isModalOpen])

	const onClose = () => {
		onCloseCurrentModal(onReset)
	}

	console.log({ removedChatsIdsLocale })

	return {
		isCurrentModal,
		isLoading,
		includedChats,
		includeChatIds: includedChats.map(chat => chat.chatId),
		localChats,
		onCloseCurrentModal: onClose,
		onReset,
		removeChat,
		onChatRemoveOrAdd,
		onSave,
	}
}
