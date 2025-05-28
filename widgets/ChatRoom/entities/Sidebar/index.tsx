import { ChatType, UserType } from "@/prisma/models"
import { Gap } from "@/shared/ui/Gap"
import { FC } from "react"
import { Header } from "./shared/ui/Header"
import { Info } from "./shared/ui/Info"

interface ISideBarProps {
	user: UserType | null
	chat: ChatType | undefined
	openSideBar: boolean
}

export const SideBar: FC<ISideBarProps> = ({ openSideBar, chat, user }) => {
	return (
		<>
			{openSideBar && (
				<div className="w-[415px] flex flex-col">
					<Header chat={chat} user={user} />
					<Gap />
					<Info chat={chat} user={user} />
					<Gap />
				</div>
			)}
		</>
	)
}
