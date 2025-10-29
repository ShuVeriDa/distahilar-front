import { MessageType } from "@/prisma/models"
import { useState } from "react"

export const useChatRoomState = () => {
	const [openSideBar, setOpenSideBar] = useState(false)
	const [editedMessage, setEditedMessage] = useState<MessageType | null>(null)
	const [callVisible, setCallVisible] = useState(false)

	const onToggleSideBar = () => setOpenSideBar(!openSideBar)

	const handleEditMessage = (message: MessageType | null) =>
		setEditedMessage(message)

	const startDialogCall = () => setCallVisible(true)
	const endDialogCall = () => setCallVisible(false)

	return {
		openSideBar,
		editedMessage,
		callVisible,
		onToggleSideBar,
		handleEditMessage,
		startDialogCall,
		endDialogCall,
	}
}
