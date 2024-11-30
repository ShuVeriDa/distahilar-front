import { FolderType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC, MouseEventHandler } from "react"
import { GoTrash } from "react-icons/go"

interface IFolderItemProps extends Partial<FolderType> {
	chatLength?: number
	onClick: () => void
	onDeleteFolder?: () => Promise<void>
}

export const FolderItem: FC<IFolderItemProps> = props => {
	const { imageUrl, name, chatLength, onClick, onDeleteFolder } = props

	const onDeleteChat: MouseEventHandler<HTMLButtonElement> = e => {
		e.stopPropagation()
		if (onDeleteFolder) onDeleteFolder()
	}

	return (
		<Button
			className={cn(
				"flex gap-1 px-5 h-[60px] !w-full !justify-between hover:bg-[#F1F1F1] dark:hover:bg-[#232E3C]"
			)}
			onClick={onClick}
		>
			<div className="flex gap-6 items-center">
				<div>
					<IconRenderer
						iconName={imageUrl as string}
						className={"[&>path]:fill-[#40A7E3] w-[17px] h-[17px]"}
					/>
				</div>
				<div className="flex flex-col gap-0.5 text-start">
					<Typography tag="p" className="text-[14px] font-bold">
						{name}
					</Typography>

					<Typography tag="p" className="text-[14px]">
						{chatLength === 0 ? "Folder is empty" : `${chatLength} chats`}
					</Typography>
				</div>
			</div>
			<Button onClick={onDeleteChat}>
				<GoTrash className="hover:fill-[#545454] fill-[#999999]" size={18} />
			</Button>
		</Button>
	)
}
