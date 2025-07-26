"use client"

import { ChatType, UserType } from "@/prisma/models"
import { FC } from "react"
import { IoIosCall, IoIosVideocam } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import { MdCallEnd } from "react-icons/md"
import { BaseCallModal, CallModalButton } from "./base-call-modal"

interface ModalCallInitiateProps {
	isOpen: boolean
	onClose: () => void
	startCall: (type: "audio" | "video") => void
	isConnecting: boolean
	callError: string | null
	chat: ChatType | undefined
	user: UserType | null
}

export const ModalCallInitiate: FC<ModalCallInitiateProps> = ({
	isOpen,
	onClose,
	startCall,
	isConnecting,
	callError,
	chat,
	user,
}) => {
	const handleAudioCall = () => {
		startCall("audio")
	}

	const handleVideoCall = () => {
		startCall("video")
	}

	const getDescription = () => {
		if (isConnecting) return "ringing..."
		if (callError) return callError
		return "Click on the Camera icon if you want to start a video call"
	}

	const getButtons = (): CallModalButton[] => {
		if (isConnecting) {
			return [
				{
					id: "end-call",
					onClick: onClose,
					icon: <MdCallEnd size={30} />,
					label: "End Call",
					iconClassName: "bg-[#D75A5A] hover:bg-[#b54343]",
				},
			]
		}

		return [
			{
				id: "video-call",
				onClick: handleVideoCall,
				icon: <IoIosVideocam size={30} />,
				label: "Start Video",
				iconClassName: "bg-[#66C95B] hover:bg-[#44973a]",
			},
			{
				id: "cancel",
				onClick: onClose,
				icon: <IoClose size={30} className="text-black" />,
				label: "Cancel",
				iconClassName: "bg-white hover:bg-[#d5d3d3]",
			},
			{
				id: "audio-call",
				onClick: handleAudioCall,
				icon: <IoIosCall size={30} />,
				label: "Start Call",
				iconClassName: "bg-[#66C95B] hover:bg-[#44973a]",
			},
		]
	}

	return (
		<BaseCallModal
			isOpen={isOpen}
			onClose={onClose}
			chat={chat}
			user={user}
			description={getDescription()}
			buttons={getButtons()}
			isConnecting={false}
			showCloseButton={true}
			className={callError ? "border border-[#D75A5A]" : undefined}
		/>
	)
}
