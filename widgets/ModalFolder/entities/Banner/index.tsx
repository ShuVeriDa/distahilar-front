import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { FcFolder } from "react-icons/fc"

interface IBannerProps {}

export const Banner: FC<IBannerProps> = () => {
	return (
		<div className="w-full gap-3 h-[170px] bg-[#F1F1F1] dark:bg-[#232E3C] flex flex-col  justify-center items-center">
			<div>
				<FcFolder size={80} />
			</div>
			<div className="w-[270px]">
				<Typography tag="p" className="text-[14px] text-center text-gray-500">
					Create folders for different groups of chats and quickly switch
					between them.
				</Typography>
			</div>
		</div>
	)
}
