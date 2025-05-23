"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { Header } from "../entities/Header"
import { Chats } from "../features/Chats"
import { IncludedChats } from "../features/IncludedChats"
import { useIncludeChats } from "../shared/hooks/useIncludeChats"

interface IModalFolderIncludeChatsProps {}

export const ModalFolderIncludeChats: FC<
	IModalFolderIncludeChatsProps
> = () => {
	const {
		onCloseCurrentModal,

		includedChats,
		includeChatIds,
		isLoading,
		localChats,
		onChatRemoveOrAdd,
		removeChat,
		onSave,
	} = useIncludeChats()
	const chatsLength = `${includedChats?.length} / 100`

	return (
		<ModalLayout
			onClose={onCloseCurrentModal}
			className="p-0"
			isClickOutside={false}
			translateX={0}
		>
			<Header chatsLength={chatsLength} />
			<IncludedChats chats={includedChats} removeChat={removeChat} />
			<Chats
				localChats={localChats}
				onChatRemoveOrAdd={onChatRemoveOrAdd}
				includeChatIds={includeChatIds}
			/>

			<ModalFooter
				isLoading={isLoading}
				onClose={onCloseCurrentModal}
				onSave={onSave}
			/>
		</ModalLayout>
	)
}
