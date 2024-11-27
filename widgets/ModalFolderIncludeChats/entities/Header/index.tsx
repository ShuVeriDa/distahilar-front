import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

interface IHeaderProps {
	chatsLength: string
}

export const Header: FC<IHeaderProps> = ({ chatsLength }) => {
	return (
		<div className="flex items-center gap-3 px-4 py-4">
			<Typography tag="h4" className="font-normal">
				Include Chats
			</Typography>
			<Typography tag="span" className="font-normal text-[#787F86] text-[13px]">
				{chatsLength}
			</Typography>
		</div>
	)
}
