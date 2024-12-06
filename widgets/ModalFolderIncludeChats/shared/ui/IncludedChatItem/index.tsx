import { FoundedChatsType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import Image from "next/image"
import { FC } from "react"
import { FaCheck } from "react-icons/fa"

interface IIncludedChatItemProps {
	chat: FoundedChatsType
	isAdded: boolean
	onClickHandler: () => void
}

export const IncludedChatItem: FC<IIncludedChatItemProps> = ({
	chat,
	isAdded,
	onClickHandler,
}) => {
	return (
		<Button
			className={cn(
				"group w-full flex items-center !justify-start gap-5 px-4 py-2 dark:hover:bg-[#292d35] hover:bg-[rgba(0,0,0,0.06)] transition duration-200"
			)}
			onClick={onClickHandler}
		>
			<div
				className={cn(
					"w-[40px] h-[40px] rounded-full relative transition-transform duration-200 ease-linear",
					isAdded && "border-[2px] border-[#5186C0] scale-110"
				)}
			>
				<Image
					src={chat.imageUrl || "/images/no-avatar.png"}
					alt={`avatar-${chat.name}`}
					width={40}
					height={40}
					className={cn(
						"rounded-full transition-transform duration-200 ease-linear",
						isAdded ? "scale-90" : "scale-100"
					)}
				/>

				<div
					className={cn(
						"absolute -bottom-1 -right-1 bg-[#40A7E3] dark:bg-[#4F83B9] w-[21px] h-[21px] rounded-full flex items-center justify-center opacity-0 border-[2px] border-white dark:border-black transition-opacity duration-200 ease-linear",
						isAdded && "opacity-100"
					)}
				>
					<FaCheck size={11} className="text-white" />
				</div>
			</div>
			<div>
				<Typography
					tag="p"
					className={cn(
						"text-[13px] text-left transition-colors duration-200",
						isAdded && "text-[#51B3F3]"
					)}
				>
					{chat.name}
				</Typography>
				<Typography
					tag="p"
					className="text-[13px] font-normal text-[#8C98A4] text-left"
				>
					{chat.type.toLocaleLowerCase()}
				</Typography>
			</div>
		</Button>
	)
}
