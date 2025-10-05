import { Typography } from "@/shared"
import { FC } from "react"

interface IHeaderOfLiveStreamProps {
	title: string | undefined
	description: string
	statusText: string
}

export const HeaderOfLiveStream: FC<IHeaderOfLiveStreamProps> = ({
	title,
	description,
	statusText,
}) => {
	return (
		<div className="w-full px-6 pt-2 pb-0.5 flex flex-col items-center justify-center ">
			<Typography
				tag="p"
				className="text-white text-[14px] font-medium text-center"
			>
				{title}
			</Typography>
			<Typography
				tag="span"
				className="text-white/60 text-[13px] font-normal text-center"
			>
				{description}
				{statusText ? ` • ${statusText}` : ""}
			</Typography>
		</div>
	)
}
