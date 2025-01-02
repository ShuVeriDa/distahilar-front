"use client"

import { MessageType } from "@/prisma/models"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useQuery } from "@tanstack/react-query"

export const useMessagesWSQuery = (chatId: string) => {
	const { socket } = useSocket()

	return useQuery<
		{ messages: MessageType[]; nextCursor: string | null },
		Error
	>({
		queryKey: ["messagesWS", chatId],
		queryFn: () =>
			new Promise<{ messages: MessageType[]; nextCursor: string | null }>(
				(resolve, reject) => {
					if (!socket) {
						reject(new Error("WebSocket is not connected"))
						return
					}

					const fetchKey = `chat:${chatId}:messages:fetch`

					socket.emit("joinChat", { chatId })

					const handleChats = (
						messages: MessageType[],
						nextCursor: string | null
					) => {
						resolve({ messages, nextCursor })
					}

					socket.on(fetchKey, handleChats)

					socket.emit("getMessages", { chatId })

					return () => {
						socket.off(fetchKey, handleChats)
					}
				}
			),
		staleTime: 1000 * 30, // 30 секунд
		enabled: !!chatId.trim(),
	})
}
