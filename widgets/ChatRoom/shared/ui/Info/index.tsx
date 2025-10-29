import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { FC } from "react"

interface IInfoProps {
	name: string | undefined
	onlineOrFollowers: string
	isOnline: boolean | undefined
}

export const Info: FC<IInfoProps> = ({ name, onlineOrFollowers, isOnline }) => {
	return (
		<div className="w-full flex flex-col">
			<div>
				<Typography tag="h6" className="font-normal">
					{name}
				</Typography>
			</div>
			<div>
				<Typography
					tag="p"
					className={cn(
						"text-[13px] !font-normal text-[#999999]",
						isOnline && "text-[#5EB5F7]"
					)}
				>
					{onlineOrFollowers}
				</Typography>
			</div>
		</div>
	)
}
