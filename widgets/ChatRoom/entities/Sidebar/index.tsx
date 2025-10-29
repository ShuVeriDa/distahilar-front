import { ChatRole, ChatType, UserType } from "@/prisma/models"
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
	onToggleSideBar: () => void
}

export const SideBar: FC<ISideBarProps> = ({
	openSideBar,
	chat,
	user,
	onToggleSideBar,
}) => {
	const { onlineOrFollowers, nameOfChat, interlocutor, isOwner, isOnline } =
		useChatInfo(chat, user)
	return (
		<>
			{openSideBar && (
				<div className="w-[415px] flex flex-col dark:bg-[#17212B] bg-white">
					<Header
						chat={chat}
						isOnline={isOnline}
						nameOfChat={nameOfChat}
						imageUrl={interlocutor?.imageUrl}
						onlineOrFollowers={onlineOrFollowers}
						onToggleSideBar={onToggleSideBar}
					/>
					<Gap />
					<Info
						chat={chat}
						bio={interlocutor?.bio}
						phone={interlocutor?.phone}
						username={interlocutor?.username}
					/>
					<Gap />
					<ManageContact
						interlocutorId={interlocutor?.id}
						interlocutorsName={interlocutor?.name}
						chatName={nameOfChat}
						interlocutorsAvatar={interlocutor?.imageUrl}
						chatId={chat?.id}
						chatType={chat?.type as ChatRole}
						isOwner={isOwner}
					/>
				</div>
			)}
		</>
	)
}
