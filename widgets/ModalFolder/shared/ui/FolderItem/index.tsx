import { FolderType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { FC, KeyboardEvent, MouseEvent, MouseEventHandler } from "react"
import { GoTrash } from "react-icons/go"

interface IFolderItemProps extends Partial<FolderType> {
	chatLength?: number
	onClick: () => void
	onDeleteFolder?: () => Promise<void>
}

export const FolderItem: FC<IFolderItemProps> = props => {
	const t = useTranslations("MODALS.FOLDERS")
	const { imageUrl, name, chatLength, onClick, onDeleteFolder } = props

	const onDeleteChat: MouseEventHandler<HTMLDivElement> = e => {
		e.stopPropagation()
		if (onDeleteFolder) onDeleteFolder()
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			onDeleteChat(e as unknown as MouseEvent<HTMLDivElement>)
		}
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
						className={"[&>path]:fill-[#40A7E3] "}
						size={20}
					/>
				</div>
				<div className="flex flex-col gap-0.5 text-start">
					<Typography tag="p" className="text-[14px] font-[600]">
						{name}
					</Typography>

					<Typography tag="p" className="text-[14px] text-[#858585] font-[400]">
						{chatLength === 0
							? t("FOLDER_IS_EMPTY")
							: `${t("CHATS_COUNT", { count: chatLength ?? 0 })}`}
					</Typography>
				</div>
			</div>
			<div
				role="button"
				onClick={onDeleteChat}
				tabIndex={0}
				onKeyDown={handleKeyDown}
			>
				<GoTrash className="hover:fill-[#545454] fill-[#999999]" size={18} />
			</div>
		</Button>
	)
}
