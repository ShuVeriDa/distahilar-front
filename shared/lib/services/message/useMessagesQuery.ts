"use client"

import {
	MediaTypeEnum,
	MessageEnum,
	MessageStatus,
	MessageType,
} from "@/prisma/models"
import { useSocket } from "@/shared/providers/SocketProvider"
import { ChatRole } from "@prisma/client"
import {
	InfiniteData,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { generateTemporaryId } from "../../utils/generateTemporaryId"

export const useMessagesWSQuery = (chatId: string) => {
	const { socket } = useSocket()
	const client = useQueryClient()

	const query = useInfiniteQuery<
		{ messages: MessageType[]; nextCursor: string | null },
		Error
	>({
		queryKey: ["messagesWS", chatId],
		initialPageParam: undefined as string | undefined,
		getNextPageParam: lastPage => lastPage?.nextCursor ?? null,
		enabled: !!chatId.trim(),
		staleTime: 1000 * 30,
		queryFn: ({ pageParam }) =>
			new Promise<{ messages: MessageType[]; nextCursor: string | null }>(
				(resolve, reject) => {
					if (!socket) {
						reject(new Error("WebSocket is not connected"))
						return
					}

					const fetchKey = `chat:${chatId}:messages:fetch`

					// Join room once per hook lifecycle (idempotent on server)
					socket.emit("joinChat", { chatId })

					const handleOnce = (
						messages: MessageType[],
						nextCursor: string | null
					) => {
						resolve({ messages, nextCursor })
					}

					// Use once to avoid listener leaks
					socket.once(fetchKey, handleOnce)

					const payload: { chatId: string; cursor?: string } = { chatId }
					if (pageParam) payload.cursor = String(pageParam)
					socket.emit("getMessages", payload)
				}
			),
	})

	// Flatten pages for convenient usage in components
	const flatMessages = useMemo(
		() => query.data?.pages.flatMap(p => p.messages) ?? [],
		[query.data]
	)

	// Real-time listeners: create, update, delete
	useEffect(() => {
		if (!socket || !chatId.trim()) return

		const createKey = `chat:${chatId}:message:create`
		const updateKey = `chat:${chatId}:message:update`
		const updatesKey = `chat:${chatId}:messages:update`

		const handleCreate = (message: MessageType) => {
			client.setQueryData<
				InfiniteData<{ messages: MessageType[]; nextCursor: string | null }>
			>(["messagesWS", chatId], old => {
				if (!old) return old
				// Avoid duplicates
				const exists = old.pages.some(p =>
					p.messages.some(m => m.id === message.id)
				)
				if (exists) return old
				const pages = [...old.pages]
				if (pages.length === 0) {
					return {
						pages: [{ messages: [message], nextCursor: null }],
						pageParams: [undefined],
					}
				}
				const lastIndex = pages.length - 1
				pages[lastIndex] = {
					...pages[lastIndex],
					messages: [...pages[lastIndex].messages, message],
				}
				return { ...old, pages }
			})
		}

		const handleUpdate = (message: MessageType) => {
			client.setQueryData<
				InfiniteData<{ messages: MessageType[]; nextCursor: string | null }>
			>(["messagesWS", chatId], old => {
				if (!old) return old
				const pages = old.pages.map(p => ({
					...p,
					messages: p.messages.map(m => (m.id === message.id ? message : m)),
				}))
				return { ...old, pages }
			})
		}

		const handleUpdates = (payload: MessageType[] | { count: number }) => {
			if (Array.isArray(payload)) {
				const idsToRemove = new Set(
					(payload as MessageType[])
						.map((m: MessageType) => m?.id)
						.filter(Boolean)
				)
				client.setQueryData<
					InfiniteData<{ messages: MessageType[]; nextCursor: string | null }>
				>(["messagesWS", chatId], old => {
					if (!old) return old
					const pages = old.pages.map(p => ({
						...p,
						messages: p.messages.filter(m => !idsToRemove.has(m.id)),
					}))
					return { ...old, pages }
				})
			} else {
				// When BatchPayload {count} returned, refresh current page
				client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
			}
		}

		socket.on(createKey, handleCreate)
		socket.on(updateKey, handleUpdate)
		socket.on(updatesKey, handleUpdates)

		return () => {
			socket.off(createKey, handleCreate)
			socket.off(updateKey, handleUpdate)
			socket.off(updatesKey, handleUpdates)
		}
	}, [socket, chatId, client])

	return {
		...query,
		flatMessages,
	}
}

export interface CreateMessageDto {
	content?: string
	mediaId?: string
	url?: string
	duration?: number
	size?: number
	name?: string
	messageType: MessageEnum
	mediaType?: MediaTypeEnum
	repliedToId?: string
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
					const optimisticMessage: MessageType = {
						// base fields
						id: temporaryId,
						chatId: chatId,
						userId: userId as string,
						createdAt: new Date() as unknown as Date,
						content: messageData.content,
						messageType: messageData.messageType,
						status: MessageStatus.PENDING,
						isPinned: false,
						deletedByUsers: [],
						readByUsers: userId ? [userId] : [],
						// relations (minimal defaults)
						media: [],
						reactions: [],
						voiceMessages: [],
						videoMessages: [],
						replies: [],
						pinnedChatId: null,
						pinnedChat: null as unknown as MessageType["pinnedChat"],
						chat: {
							id: chatId,
							type: chatRole,
						} as unknown as MessageType["chat"],
						user: undefined as unknown as MessageType["user"],
						_count: undefined as unknown as MessageType["_count"],
					} as unknown as MessageType

					client.setQueryData<
						InfiniteData<{ messages: MessageType[]; nextCursor: string | null }>
					>(["messagesWS", chatId], old => {
						if (!old) {
							return {
								pages: [{ messages: [optimisticMessage], nextCursor: null }],
								pageParams: [undefined],
							}
						}
						const exists = old.pages.some(p =>
							p.messages.some((m: MessageType) => m.id === temporaryId)
						)
						if (exists) return old
						const pages = [...old.pages]
						const lastIndex = pages.length - 1
						pages[lastIndex] = {
							...pages[lastIndex],
							messages: [...pages[lastIndex].messages, optimisticMessage],
						}
						return { ...old, pages }
					})
				}

				socket.emit(
					"createMessage",
					{ chatId, ...messageData },
					(response: MessageType) => {
						client.setQueryData<
							InfiniteData<{
								messages: MessageType[]
								nextCursor: string | null
							}>
						>(["messagesWS", chatId], old => {
							if (!old) return old
							const pages = old.pages.map(p => ({
								...p,
								messages: p.messages.map((m: MessageType) =>
									m.id === temporaryId ? (response as MessageType) : m
								),
							}))
							return { ...old, pages }
						})
						resolve()
					}
				)
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
		},
		onError: error => {
			client.setQueryData<
				InfiniteData<{ messages: MessageType[]; nextCursor: string | null }>
			>(["messagesWS", chatId], old => {
				if (!old) return old
				const pages = old.pages.map(p => ({
					...p,
					messages: p.messages.filter(
						(msg: MessageType) => msg.status !== MessageStatus.PENDING
					),
				}))
				return { ...old, pages }
			})
			console.error("Message sending failed:", error)
		},
	})
}

export interface EditMessageDto extends Partial<CreateMessageDto> {
	messageId: string
}

export const useEditMessage = (chatId: string) => {
	const { socket } = useSocket()

	const client = useQueryClient()

	return useMutation<void, Error, EditMessageDto>({
		mutationKey: ["message:update", chatId],
		mutationFn: messageData =>
			new Promise<void>((resolve, reject) => {
				if (!socket) {
					reject(new Error("WebSocket is not connected"))
					return
				}

				socket.emit("editMessage", { chatId, ...messageData }, () => resolve())
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

				socket.emit("pinMessage", { ...pinMessage }, () => {
					resolve()
				})
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

				socket.emit("deleteMessage", { ...pinMessage }, () => {
					resolve()
				})
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS", chatId] })
		},
	})
}
