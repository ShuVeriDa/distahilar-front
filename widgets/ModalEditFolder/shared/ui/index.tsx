import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { Skeleton } from "@/shared/ui/Skeleton/skeleton"
import { Typography } from "@/shared/ui/Typography/Typography"
import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared/types/types.type"
import Image from "next/image"
import { IoIosClose } from "react-icons/io"
import { twMerge } from "tailwind-merge"

interface IChatItemProps extends ICutChat {
	onDeleteChat: () => void
}

export const ChatItem = ({ ...props }: IChatItemProps) => {
	const { imageUrl, name, onDeleteChat } = props

	return (
		<div className="flex justify-between items-center">
			<div className="flex gap-2">
				<div
					className={twMerge(`flex w-full h-full`)}
					style={{
						maxWidth: `35px`,
						maxHeight: `35px`,
					}}
				>
					<Image
						src={imageUrl || "/images/no-avatar.png"}
						alt={"avatar"}
						className={cn(`w-full h-full rounded-full`)}
						width={35}
						height={35}
					/>
				</div>

				<div className="flex items-center">
					<Typography tag="p" className="text-[13px]">
						{name}
					</Typography>
				</div>
			</div>

			<Button className="group px-1 h-full" onClick={onDeleteChat}>
				<IoIosClose
					size={25}
					className="group-hover:[&>path]:fill-[#a6afb7]"
					color="#54606B"
				/>
			</Button>
		</div>
	)
}

ChatItem.Skeleton = function MyFolders() {
	return (
		<div className="flex justify-between items-center">
			<div className="flex gap-2 h-full items-center">
				<Skeleton className="w-[35px] h-[35px] rounded-full bg-gray-50" />

				<div className="h-full flex items-center">
					<Skeleton className="w-[150px] h-[10px] bg-gray-50" />
				</div>
			</div>

			<Skeleton className="w-[15px]  h-[15px] mr-3 bg-gray-50" />
		</div>
	)
}
