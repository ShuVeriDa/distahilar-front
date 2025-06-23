import { MediaTypeEnum, MessageStatus, MessageType } from "@/prisma/models"
import { Skeleton } from "@/shared"
import { FileItem } from "@/widgets/ModalAddFile/features/Fileitem"
import Image from "next/image"
import { FC } from "react"

interface IMessageFileProps {
	message: MessageType
}

export const MessageFile: FC<IMessageFileProps> = ({ message }) => {
	const media = message.media[0]

	const isPending = message.status === MessageStatus.PENDING

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
					<Image
						src={media.url}
						alt={media.name ?? ""}
						width={0}
						height={0}
						sizes="100vw"
						className="w-auto h-auto max-w-full max-h-full object-contain rounded-2xl"
						unoptimized={true}
					/>
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
		</>
	)
}
