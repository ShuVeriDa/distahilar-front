import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { FC } from "react"

interface IRemainingTimeProps {
	remainingTime: string
}

export const RemainingTime: FC<IRemainingTimeProps> = ({ remainingTime }) => {
	return (
		<div
			className={cn(
				"flex gap-1.5 items-center bg-green-900/30 py-0.5 px-1.5 rounded-md absolute bottom-0.5 left-2.5"
			)}
		>
			<Typography tag="p" className={cn("text-[12px] leading-5 text-white")}>
				{remainingTime}
			</Typography>
		</div>
	)
}
