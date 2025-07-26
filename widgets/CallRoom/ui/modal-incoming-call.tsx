"use client"

import { ChatType, UserType } from "@/prisma/models"
import { Button } from "@/shared"
import { CallNotification } from "@/shared/lib/services/call/call.types"
import { FC } from "react"
import { IoIosCall } from "react-icons/io"
import { MdCallEnd } from "react-icons/md"
import { BaseCallModal, CallModalButton } from "./base-call-modal"

interface ModalIncomingCallProps {
	isOpen: boolean
	answerCall: (accept: boolean) => void
	incomingCall: CallNotification | null
	isConnecting: boolean
	chat: ChatType | undefined
	user: UserType | null
}

export const ModalIncomingCall: FC<ModalIncomingCallProps> = ({
	isOpen,
	answerCall,
	incomingCall,
	isConnecting,
	chat,
	user,
}) => {
	const handleAccept = () => {
		console.log("User accepted call")
		answerCall(true)
	}

	const handleReject = () => {
		console.log("User rejected call")
		answerCall(false)
	}

	const buttons: CallModalButton[] = [
		{
			id: "reject",
			onClick: handleReject,
			icon: <MdCallEnd size={30} />,
			label: "Decline",
			iconClassName: "bg-[#D75A5A] hover:bg-[#b54343]",
		},
		{
			id: "accept",
			onClick: handleAccept,
			icon: <IoIosCall size={30} />,
			label: "Accept",
			iconClassName: "bg-[#66C95B] hover:bg-[#44973a]",
		},
	]

	const connectingContent = (
		<div className="text-center py-4">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p className="text-gray-600 dark:text-gray-400">Подключаемся...</p>
			<p className="text-xs text-gray-500 mt-2">Ожидаем ответ от сервера</p>

			<Button
				onClick={handleReject}
				className="flex flex-col items-center gap-2 text-white text-[14px] mt-4"
				variant="clean"
			>
				<div className="flex items-center gap-2 bg-[#D75A5A] hover:bg-[#b54343] p-2 rounded-full">
					<MdCallEnd size={30} />
				</div>
				<span>Decline</span>
			</Button>
		</div>
	)

	return (
		<BaseCallModal
			isOpen={isOpen}
			chat={chat}
			user={user}
			description="is calling you..."
			buttons={buttons}
			isConnecting={isConnecting}
			connectingContent={connectingContent}
			shouldRender={!!incomingCall}
			showCloseButton={false}
		/>
	)
}
