import { IImageSlide, LightboxWrapper } from "@/features/LightBox/ui/LightBox"
import { MediaTypeEnum, MessageStatus, MessageType } from "@/prisma/models"
import { Skeleton } from "@/shared"
import { FileItem } from "@/widgets/ModalAddFile/features/Fileitem"

import { FC } from "react"

interface IMessageFileProps {
	message: MessageType
	allImages: IImageSlide[]
}

export const MessageFile: FC<IMessageFileProps> = ({ message, allImages }) => {
	const media = message.media[0]

	const isPending: boolean = message.status === MessageStatus.PENDING

	return (
		<>
			{media.type === MediaTypeEnum.FILE ? (
				<>
					<FileItem
						name={media.name ?? "название файла"}
						size={media.size ?? 0}
						type={(media.type as MediaTypeEnum) ?? MediaTypeEnum.FILE}
						variant="message"
					/>
				</>
			) : media.type === MediaTypeEnum.IMAGE ? (
				!isPending ? (
					<LightboxWrapper allImages={allImages} media={media} />
				) : (
					<Skeleton className="w-[300px] h-[200px] bg-[#F1F1F1] dark:bg-[#202B38]" />
				)
			) : (
				<FileItem
					name={media.name ?? "название файла"}
					size={media.size ?? 0}
					type={(media.type as MediaTypeEnum) ?? MediaTypeEnum.FILE}
					variant="message"
				/>
			)}

			{/* {message.content && (
				<div
					className={cn(
						"px-3 py-1 flex flex-col w-fit",
						media.type === MediaTypeEnum.FILE && "px-0"
					)}
				>
					<Typography tag="p" className="text-[14px] leading-5">
						{message.content}
					</Typography>{" "}
				</div>
			)} */}
		</>
	)
}
