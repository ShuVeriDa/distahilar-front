import { ChatType, MessageType } from "@/prisma/models"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

interface UseChatRoomNavigationProps {
	chatId: string
	chat: ChatType | undefined
	locale: string
	flatMessages: MessageType[]
}

export const useChatRoomNavigation = ({
	chatId,
	chat,
	locale,
	flatMessages,
}: UseChatRoomNavigationProps) => {
	const router = useRouter()
	const client = useQueryClient()

	// Normalize URL to real chat id if dialog was created from user id param
	useEffect(() => {
		if (chat?.id && chatId !== chat.id) {
			router.replace(`/${locale}/chat/${chat.id}`)
			// ensure chats list reflects the new chat
			client.invalidateQueries({ queryKey: ["fetchChatsWS"] })
		}
	}, [chat?.id, chatId, router, locale, client])

	// If chat was auto-created for this navigation, refresh chats list
	// only after the first message appears, so it shows up in the sidebar
	const didRefreshChatsRef = useRef(false)
	const isAutoCreated = !!(chat?.id && chatId !== chat.id)
	useEffect(() => {
		if (!isAutoCreated) return
		if (didRefreshChatsRef.current) return
		if ((flatMessages?.length || 0) > 0) {
			client.invalidateQueries({ queryKey: ["fetchChatsWS"] })
			didRefreshChatsRef.current = true
		}
	}, [isAutoCreated, flatMessages, client])
}
