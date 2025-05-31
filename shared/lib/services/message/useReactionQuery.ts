import { MessageType } from "@/prisma/models"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface CreateReactionDto {
	chatId: string
	messageId: string
	emoji: string
}

export const useAddReaction = () => {
	const { socket } = useSocket()

	const client = useQueryClient()

	return useMutation<void, Error, CreateReactionDto>({
		mutationKey: ["addReaction"],
		mutationFn: data =>
			new Promise<void>((resolve, reject) => {
				if (!socket) {
					reject(new Error("WebSocket is not connected"))
					return
				}

				socket.emit("createReaction", { ...data }, (response: MessageType) =>
					resolve()
				)
			}),

		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["messagesWS"] })
		},
	})
}
