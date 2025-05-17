"use client"

import {
	MediaType,
	MessageEnum,
	MessageStatus,
	MessageType,
} from "@/prisma/models"
import { useSocket } from "@/shared/providers/SocketProvider"
import { ChatRole } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { generateTemporaryId } from "../../utils/generateTemporaryId"

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

export const useSendMessage = (
	chatId: string,
	chatRole: ChatRole | undefined,
	userId: string | undefined
) => {
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

				const temporaryId = generateTemporaryId()

				if (messageData.messageType === MessageEnum.TEXT) {
					const optimisticMessage = {
						...messageData,
						id: temporaryId,
						status: MessageStatus.PENDING,
						userId: userId,
						chatType: chatRole,
						createdAt: new Date().toISOString(),
					}

					client.setQueryData(
						["messagesWS", chatId],
						(oldData: {
							messages: MessageType[]
							nextCursor: string | null
						}) => {
							if (
								oldData.messages.some(
									(msg: MessageType) => msg.id === temporaryId
								)
							) {
								return oldData
							}

							return {
								...oldData,
								messages: [...oldData.messages, optimisticMessage],
							}
						}
					)
				}

				socket.emit(
					"createMessage",
					{ chatId, ...messageData },
					(response: MessageType) => {
						client.setQueryData(
							["messagesWS", chatId],
							(oldData: {
								messages: MessageType[]
								nextCursor: string | null
							}) => {
								const newMessage = {
									...response,
									chat: {
										type: chatRole,
									},
								}

								const updatedMessages = oldData.messages.map(
									(msg: MessageType) =>
										msg.id === temporaryId ? { ...newMessage } : msg
								)
								return { ...oldData, messages: updatedMessages }
							}
						)
						resolve()
					}
				)
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
		},
		onError: error => {
			client.setQueryData(
				["messagesWS", chatId],
				(oldData: { messages: MessageType[]; nextCursor: string | null }) => {
					const updatedMessages = oldData.messages.filter(
						(msg: MessageType) => msg.status !== MessageStatus.PENDING
					)
					return { ...oldData, messages: updatedMessages }
				}
			)
			console.error("Message sending failed:", error)
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
	messageIds: string[]
	delete_both: boolean
}

export const useDeleteMessage = (chatId: string) => {
	const { socket } = useSocket()

	const client = useQueryClient()

	return useMutation<void, Error, DeleteMessageDto>({
		mutationKey: [`chat:${chatId}:messages:update`, chatId],
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
