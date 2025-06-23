import { MediaTypeEnum } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { formatFileName } from "@/shared/hooks/formatFileName"
import { cn } from "@/shared/lib/utils/cn"
import { formatBytes } from "@/shared/lib/utils/formatBytes"
import { FC } from "react"
import { BiSolidFileBlank } from "react-icons/bi"
import { BsFileImageFill } from "react-icons/bs"
import { FaFileAudio, FaFileVideo } from "react-icons/fa6"
import { MdDelete } from "react-icons/md"

export const FileItemVariants = {
	variants: {
		uploadingFile: {
			wrapper: "!min-h-11",
			icon: " w-full h-full max-h-11 max-w-11 bg-[#40A7E3]",
			name: "text-[12px]",
			button: "!flex",
		},
		message: {
			wrapper: "",
			icon: "!w-11 !h-11 bg-[#5FBE67] dark:bg-[#4C9CE2]",
			name: "text-[14px]",
			button: "!hidden",
		},
	} as const,
}

interface IFileItemProps {
	name: string
	size: number
	type: MediaTypeEnum
	variant: keyof typeof FileItemVariants.variants
	onDeleteFile?: () => void
}

export const FileItem: FC<IFileItemProps> = ({
	name,
	size,
	type,
	variant,
	onDeleteFile,
}) => {
	const wrapperClassName = FileItemVariants.variants[variant].wrapper
	const iconClassName = FileItemVariants.variants[variant].icon
	const buttonClassName = FileItemVariants.variants[variant].button
	const nameClassName = FileItemVariants.variants[variant].name

	const sizeOfFail = formatBytes(size)

	const Icon =
		type === MediaTypeEnum.IMAGE ? (
			<BsFileImageFill className="w-6 h-6" color="white" />
		) : type === MediaTypeEnum.VIDEO ? (
			<FaFileVideo className="w-6 h-6" color="white" />
		) : type === MediaTypeEnum.AUDIO ? (
			<FaFileAudio className="w-6 h-6" color="white" />
		) : (
			<BiSolidFileBlank className="w-6 h-6" color="white" />
		)

	return (
		<div className={cn("w-full h-full flex gap-3 pr-5", wrapperClassName)}>
			<div className="w-full h-full max-w-11 max-h-11 flex items-center justify-center">
				<div
					className={cn(
						" flex items-center justify-center rounded-full bg-[#40A7E3]",
						iconClassName
					)}
				>
					{Icon}
				</div>
			</div>

			<div className="w-full flex items-end">
				<div className="w-full flex justify-between">
					<div className="flex flex-col gap-0.5">
						<Typography tag="p" className={cn(nameClassName, "font-medium")}>
							{formatFileName(name)}
						</Typography>

						<Typography
							tag="p"
							className="text-[12px] font-[300] text-[#A0ACB6]"
						>
							{sizeOfFail}
						</Typography>
					</div>
					<Button
						onClick={onDeleteFile}
						className={cn("hover:cursor-pointer", buttonClassName)}
					>
						<MdDelete
							size={20}
							className="text-[#999999] hover:text-[#858484]"
						/>
					</Button>
				</div>
			</div>
		</div>
	)
}
