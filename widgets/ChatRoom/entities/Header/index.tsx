import {
	ChatMemberType,
	ChatRole,
	ChatType,
	MessageType,
} from "@/prisma/models"
import { useUser } from "@/shared"
import { useFormatLastSeen } from "@/shared/lib/utils/formatLastSeen"
import { FC } from "react"
import { Buttons } from "../../features/Buttons"
import { HeaderSelectedMessages } from "../../features/HeaderSelectedMessages"
import { Info } from "../../shared/ui/Info"

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
		<div className="w-full flex items-center  bg-white min-h-[50px] py-2 px-3 border-b border-b-[#E7E7E7]">
			{!hasSelectedMessages ? (
				<div className="w-full flex items-center justify-between ">
					<Info name={name} onlineOrFollowers={onlineOrFollowers} />
					<Buttons />
				</div>
			) : (
				<HeaderSelectedMessages
					selectedMessages={selectedMessages}
					clearSelectedMessages={clearSelectedMessages}
					name={name}
				/>
			)}
		</div>
	)
}
