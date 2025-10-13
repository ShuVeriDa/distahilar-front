import { FoundedChatsType } from "@/prisma/models"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { chatService, IDeleteChatRequest } from "./chat.service"

export const useFetchChatByIdQuery = (chatId: string) => {
	return useQuery({
		queryFn: async () => await chatService.getChatById(chatId),
		queryKey: ["fetchChatById", chatId],
		enabled: !!chatId,
	})
}

export const useFetchChatsQuery = (params?: string) => {
	return useQuery({
		queryFn: async () => await chatService.searchChat(params!),
		queryKey: ["fetchChats", params],
		enabled: !!params,
	})
}

export const useDeleteChatQuery = (chatId: string) => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (data: IDeleteChatRequest) =>
			chatService.deleteChat(chatId, data),
		mutationKey: ["deleteChat", chatId],
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ["messagesWS", chatId],
			})
		},
	})
}

export const useJoinChatQuery = (chatId: string) => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (data: { link: string }) => chatService.joinChat(data.link),
		mutationKey: ["joinChat", chatId],
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ["fetchChatById", chatId],
			})
		},
	})
}

export const useSearchChatsWSQuery = (query: string) => {
	const { socket } = useSocket()

	return useQuery<FoundedChatsType[], Error>({
		queryKey: ["searchChatsWS", query], // Ключ запроса
		queryFn: () =>
			new Promise<FoundedChatsType[]>((resolve, reject) => {
				if (!socket) {
					reject(new Error("WebSocket is not connected"))
					return
				}

				const fetchKey = `chats:query:${query}:search`

				// Обработчик данных
				const handleChats = (data: FoundedChatsType[]) => {
					resolve(data)
				}

				// Подписка на событие
				socket.on(fetchKey, handleChats)

				// Отправка запроса
				socket.emit("searchChats", { name: query })

				// Очистка подписки при завершении запроса
				return () => {
					socket.off(fetchKey, handleChats)
				}
			}),
		// Запрос выполняется только при наличии значения
		staleTime: 1000 * 30, // Данные считаются актуальными в течение 30 секунд
		enabled: !!query.trim(),
	})
}
