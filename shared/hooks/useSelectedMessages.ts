"use client"

import { MessageType } from "@/prisma/models"
import { useState } from "react"
import { useDeleteMessage } from "../lib/services/message/useMessagesQuery"
import { useUser } from "./useUser"

export const useSelectedMessages = () => {
	const { user } = useUser()
	const userId = user?.id
	const [selectedMessages, setSelectedMessages] = useState<MessageType[]>([])

	const hasSelectedMessages = !!selectedMessages.length

	const clearSelectedMessages = () => setSelectedMessages([])

	const { mutateAsync } = useDeleteMessage(selectedMessages[0]?.chatId ?? "")

	console.log(!!selectedMessages.map(msg => msg.userId === userId))

	const deleteMessages = () => {
		mutateAsync({
			messageIds: selectedMessages.map(msg => msg.id),
			chatId: selectedMessages[0].chatId,
			delete_both: !!selectedMessages.map(msg => msg.userId === userId),
		})
	}

	return {
		selectedMessages,
		hasSelectedMessages,
		setSelectedMessages,
		clearSelectedMessages,
		deleteMessages,
	}
}
