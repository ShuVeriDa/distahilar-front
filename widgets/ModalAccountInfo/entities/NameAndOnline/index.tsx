import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

interface INameAndOnlineProps {
	name: string
}

export const NameAndOnline: FC<INameAndOnlineProps> = ({ name }) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<Typography tag="p" className="text-[18px]">
				{name}
			</Typography>

			<Typography tag="span" className="text-[13px] font-normal text-[#708499]">
				Last seen 2 minutes ago (Исправить)
			</Typography>
		</div>
	)
}
