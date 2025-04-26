import {
	ChatMemberType,
	ChatRole,
	ChatType,
	MessageType,
} from "@/prisma/models"
import { useUser } from "@/shared"
import { useFormatLastSeen } from "@/shared/lib/utils/formatLastSeen"
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
	hasSelectedMessages: boolean
	selectedMessages: MessageType[]
	clearSelectedMessages: () => void
}

export const Header: FC<IHeaderProps> = ({
	chat,
	hasSelectedMessages,
	selectedMessages,
	clearSelectedMessages,
}) => {
	const { user } = useUser()
	const userInfo = chat?.members.find(
		(m: ChatMemberType) => m.userId !== user?.id
	)?.user

	const isDialog = chat?.type === ChatRole.DIALOG

	const name = isDialog ? userInfo?.name : chat?.name
	const lastSeen = useFormatLastSeen(userInfo?.lastSeen)

	const online = userInfo?.isOnline
		? "online"
		: `${userInfo?.lastSeen ? lastSeen : " "}`

	const onlineOrFollowers = isDialog
		? online
		: `${chat?.members.length} subscribers `

	return (
		<div className="w-full flex flex-col items-center  bg-white min-h-[50px] py-2 px-3 border-b border-b-[#E7E7E7]">
			<AnimatePresence mode="wait">
				{!hasSelectedMessages ? (
					<MotionDiv
						key="chat-header"
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						transition={{ duration: 0.1 }}
						className="w-full flex items-center justify-between"
					>
						<Info name={name} onlineOrFollowers={onlineOrFollowers} />
						<Buttons />
					</MotionDiv>
				) : (
					<HeaderSelectedMessages
						selectedMessages={selectedMessages}
						clearSelectedMessages={clearSelectedMessages}
						name={name}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
