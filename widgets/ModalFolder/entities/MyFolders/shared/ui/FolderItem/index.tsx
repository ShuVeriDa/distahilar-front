import { FolderType } from "@/prisma/models"
import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { GoTrash } from "react-icons/go"

interface IFolderItemProps extends FolderType {
	chatLength: number
}

export const FolderItem: FC<IFolderItemProps> = props => {
	const { onOpenModal } = useModal()
	const { imageUrl, id, name, chatLength } = props

	const onClickModal = () =>
		onOpenModal(EnumModel.EDIT_FOLDER, { folderId: id })

	return (
		<Button
			className={cn(
				"flex gap-1 px-5 h-[60px] !w-full !justify-between hover:bg-[#F1F1F1] dark:hover:bg-[#232E3C]"
			)}
			onClick={onClickModal}
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
						{chatLength} chats
					</Typography>
				</div>
			</div>
			<div>
				<GoTrash className="hover:fill-[#545454] fill-[#999999]" size={18} />
			</div>
		</Button>
	)
}
