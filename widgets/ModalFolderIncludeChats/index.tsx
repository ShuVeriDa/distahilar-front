"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { Chats } from "./entities/Chats"
import { Header } from "./entities/Header"
import { IncludedChats } from "./entities/IncludedChats"
import { useIncludeChats } from "./shared/hooks/useIncludeChats"

interface IModalFolderIncludeChatsProps {}

export const ModalFolderIncludeChats: FC<
	IModalFolderIncludeChatsProps
> = ({}) => {
	const {
		isCurrentModal,
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
			isCurrentModal={isCurrentModal}
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
