import { ChatType, UserType } from "@/prisma/models"
import { useChatInfo } from "@/shared/hooks/useChatInfo"
import { Gap } from "@/shared/ui/Gap"
import { FC } from "react"
import { ManageContact } from "../../features/ManageContact/ui"
import { Header } from "./shared/ui/Header"
import { Info } from "./shared/ui/Info"

interface ISideBarProps {
	user: UserType | null
	chat: ChatType | undefined
	openSideBar: boolean
}

export const SideBar: FC<ISideBarProps> = ({ openSideBar, chat, user }) => {
	const { onlineOrFollowers, nameOfChat, interlocutor } = useChatInfo(
		chat,
		user
	)
	return (
		<>
			{openSideBar && (
				<div className="w-[415px] flex flex-col">
					<Header
						chat={chat}
						nameOfChat={nameOfChat}
						imageUrl={interlocutor?.imageUrl}
						onlineOrFollowers={onlineOrFollowers}
					/>
					<Gap />
					<Info chat={chat} user={user} />
					<Gap />
					<ManageContact interlocutorId={interlocutor?.id} />
				</div>
			)}
		</>
	)
}
