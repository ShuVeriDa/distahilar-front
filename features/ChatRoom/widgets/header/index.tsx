import { ChatType } from "@/prisma/models"
import { FC } from "react"
import { Buttons } from "../../features/Buttons"
import { Info } from "../../shared/ui/Info"

interface IHeaderProps {
	chat: ChatType | undefined
}

export const Header: FC<IHeaderProps> = ({ chat }) => {
	return (
		<div className="w-full flex items-center justify-between bg-white min-h-[50px] py-2 px-3 border-b border-b-[#E7E7E7]">
			<Info chat={chat} />
			<Buttons />
		</div>
	)
}
