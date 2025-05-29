import { ChatType, MessageType, UserType } from "@/prisma/models"
import { useChatInfo } from "@/shared/hooks/useChatInfo"
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
	chat: ChatType | undefined
	user: UserType | null
	hasSelectedMessages: boolean
	selectedMessages: MessageType[]
	openSideBar: boolean
	clearSelectedMessages: () => void
	actionsForButtons: (() => void)[]
}

export const Header: FC<IHeaderProps> = ({
	chat,
	user,
	hasSelectedMessages,
	selectedMessages,
	openSideBar,
	clearSelectedMessages,
	actionsForButtons,
}) => {
	const { onlineOrFollowers, nameOfChat } = useChatInfo(chat, user)

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
						<Info name={nameOfChat} onlineOrFollowers={onlineOrFollowers} />
						<Buttons
							actionsForButtons={actionsForButtons}
							openSideBar={openSideBar}
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
