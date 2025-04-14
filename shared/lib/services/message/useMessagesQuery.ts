"use client"

import { MediaType, MessageEnum, MessageType } from "@/prisma/models"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

export interface CreateMessageDto {
	content: string
	mediaId?: string
	url?: string
	duration?: number
	size?: number
	messageType: MessageEnum
	mediaType?: MediaType
}

export const useSendMessage = (chatId: string) => {
	const { socket } = useSocket()

	const client = useQueryClient()

	return useMutation<void, Error, CreateMessageDto>({
		mutationKey: ["message:create", chatId],
		mutationFn: messageData =>
			new Promise<void>((resolve, reject) => {
				if (!socket) {
					reject(new Error("WebSocket is not connected"))
					return
				}

				socket.emit(
					"createMessage",
					{ chatId, ...messageData },
					(response: MessageType) => {
						resolve()
					}
				)
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
		},
	})
}

export interface PinMessageDto {
	chatId: string
	messageId: string
}

export const usePinMessage = (chatId: string) => {
	const { socket } = useSocket()

	const client = useQueryClient()

	return useMutation<void, Error, PinMessageDto>({
		mutationKey: [`chat:${chatId}:message:update`, chatId],
		mutationFn: pinMessage =>
			new Promise<void>((resolve, reject) => {
				if (!socket) {
					reject(new Error("WebSocket is not connected"))
					return
				}

				socket.emit(
					"pinMessage",
					{ ...pinMessage },
					(response: MessageType) => {
						resolve()
					}
				)
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
		},
	})
}

export interface DeleteMessageDto {
	chatId: string
	messageId: string
	delete_both: boolean
}

export const useDeleteMessage = (chatId: string) => {
	const { socket } = useSocket()

	const client = useQueryClient()

	return useMutation<void, Error, DeleteMessageDto>({
		mutationKey: [`chat:${chatId}:message:update`, chatId],
		mutationFn: pinMessage =>
			new Promise<void>((resolve, reject) => {
				if (!socket) {
					reject(new Error("WebSocket is not connected"))
					return
				}

				socket.emit(
					"deleteMessage",
					{ ...pinMessage },
					(response: MessageType) => {
						resolve()
					}
				)
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
		},
	})
}
