import { Typography } from "@/shared"
import { FC } from "react"

interface IInfoProps {
	name: string | undefined
	onlineOrFollowers: string
}

export const Info: FC<IInfoProps> = ({ name, onlineOrFollowers }) => {
	return (
		<div className="w-full flex flex-col">
			<div>
				<Typography tag="h6" className="font-normal">
					{name}
				</Typography>
			</div>
			<div>
				<Typography tag="p" className="text-[13px] !font-normal text-[#999999]">
					{onlineOrFollowers}
				</Typography>
			</div>
		</div>
	)
}
