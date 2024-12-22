import { FoundedChatsType } from "@/prisma/models"
import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { FC } from "react"

interface IStatusSearchProps {
	isLoading: boolean
	query: string
	chats: FoundedChatsType[] | undefined
}

export const StatusSearch: FC<IStatusSearchProps> = ({
	chats,
	isLoading,
	query,
}) => {
	return (
		<div
			className={cn(
				"hidden w-full items-center px-3 bg-[#F1F1F1] dark:bg-[#202B38] h-[25px]",
				(isLoading || (chats && chats?.length > 0 && query.length > 0)) &&
					"flex"
			)}
		>
			<Typography
				tag="p"
				className={cn("text-[#919191] dark:text-white font-normal text-[13px]")}
			>
				{isLoading ? "Loading..." : `Found ${chats?.length} chats`}
			</Typography>
		</div>
	)
}
