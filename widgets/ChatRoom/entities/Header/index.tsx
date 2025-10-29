import { ChatRole, MemberRole, MessageType } from "@/prisma/models"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FC } from "react"
import { Buttons } from "../../features/Buttons"
import { HeaderSelectedMessages } from "../../features/HeaderSelectedMessages"
import { Info } from "../../shared/ui/Info"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IHeaderProps {
	chatType: ChatRole
	openSideBar: boolean
	memberRole: MemberRole
	onlineOrFollowers: string
	hasSelectedMessages: boolean
	isOnline: boolean | undefined
	nameOfChat: string | undefined
	selectedMessages: MessageType[]
	actionsForButtons: (() => void)[]
	clearSelectedMessages: () => void
}

export const Header: FC<IHeaderProps> = ({
	isOnline,
	chatType,
	memberRole,
	nameOfChat,
	openSideBar,
	selectedMessages,
	onlineOrFollowers,
	actionsForButtons,
	hasSelectedMessages,
	clearSelectedMessages,
}) => {
	return (
		<div className="w-full flex flex-col items-center dark:bg-[#17212B] bg-white min-h-[50px] py-2 px-3 border-b border-b-[#E7E7E7] dark:border-b-[#101921]">
			<AnimatePresence mode="wait">
				{!hasSelectedMessages ? (
					<MotionDiv
						key="chat-header"
						// initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						transition={{ duration: 0.1 }}
						className="w-full flex items-center justify-between"
					>
						<Info
							name={nameOfChat}
							onlineOrFollowers={onlineOrFollowers}
							isOnline={isOnline}
						/>
						<Buttons
							actionsForButtons={actionsForButtons}
							openSideBar={openSideBar}
							memberRole={memberRole}
							chatType={chatType}
						/>
					</MotionDiv>
				) : (
					<HeaderSelectedMessages
						selectedMessages={selectedMessages}
						clearSelectedMessages={clearSelectedMessages}
						name={nameOfChat}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
