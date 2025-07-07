import {
	ChatRole,
	MediaType,
	MediaTypeEnum,
	MessageStatus,
	MessageType,
	ReactionTypeFromMessage,
} from "@/prisma/models"
import { Typography } from "@/shared"
import { useAddReaction } from "@/shared/lib/services/message/useReactionQuery"
import { cn } from "@/shared/lib/utils/cn"
import { formatTime } from "@/shared/lib/utils/formatTime"
import { IsRead } from "@/shared/ui/isRead"
import { ManageReaction } from "@/widgets/ChatRoom/features/ManageReaction/ui"
import { FC } from "react"
import { TiPin } from "react-icons/ti"

interface IMessageInfoProps {
	message: MessageType
	isFile: boolean
	isCircleVideo: boolean
	isMoreTwoLine: boolean | 0 | null
	isMyMessage: boolean
	isVoice: boolean
	isHasReactions: boolean
	userId: string | undefined
	media: MediaType | null
	isMessageContent: boolean
}

export const MessageInfo: FC<IMessageInfoProps> = ({
	message,
	isCircleVideo,
	isMoreTwoLine,
	isMyMessage,
	isVoice,
	isHasReactions,
	userId,
	isFile,
	media,
	isMessageContent,
}) => {
	const duration = formatTime(message.createdAt, "hh:mm")
	const isPinned = message.isPinned
	const isDialog = message.chat?.type === ChatRole.DIALOG
	const isImageFile = isFile && media?.type === MediaTypeEnum.IMAGE
	const isVideoFile = isFile && media?.type === MediaTypeEnum.VIDEO

	const { mutateAsync: addReaction } = useAddReaction()

	return (
		<div
			className={cn(
				"h-full flex items-end relative",
				isMoreTwoLine && "justify-end absolute bottom-2 right-[12px]",
				isMyMessage && !isMoreTwoLine && " -right-2 z-[20]",
				isVoice && "absolute bottom-2",
				isHasReactions &&
					"justify-between relative bottom-3 right-[12px] z-[20] pl-2 gap-5 w-[calc(100%+20px)]",
				isHasReactions && !isMyMessage && "w-[calc(100%+14px)]",
				(isImageFile || isVideoFile) &&
					!isMessageContent &&
					"absolute bottom-3 right-[8px]",
				(isImageFile || isVideoFile) &&
					isMessageContent &&
					"absolute bottom-2 right-[12px]"
			)}
		>
			<div className="w-full flex gap-1 ">
				{isHasReactions &&
					message.reactions.map((r, i) => (
						<ManageReaction
							key={i}
							userId={userId}
							chatId={message.chatId}
							isDialog={isDialog}
							isMyMessage={isMyMessage}
							reaction={r as ReactionTypeFromMessage}
							addReaction={addReaction}
						/>
					))}
			</div>
			<div
				className={cn(
					" flex gap-1.5 items-center relative top-1.5 ",
					(isCircleVideo ||
						((isImageFile || isVideoFile) && !isMessageContent)) &&
						"bg-green-900/30 py-0.5 px-1.5 rounded-md absolute",

					isCircleVideo && !isHasReactions && "top-[230px]",
					isHasReactions && "absolute right-0 -bottom-[17px]",
					(isImageFile || isVideoFile) &&
						!isMessageContent &&
						"top-[calc(100%-20px)] right-0"
				)}
			>
				{isPinned && (
					<TiPin
						size={20}
						className={cn(
							"",
							isMyMessage
								? "text-[#6DB566] dark:text-[#488DD3]"
								: "text-[#A0ACB6] dark:text-[#6D7F8F]"
						)}
					/>
				)}
				<Typography
					tag="p"
					className={cn(
						"text-[12px] leading-5",
						isMyMessage
							? "text-[#6DB566] dark:text-[#488DD3]"
							: "text-[#A0ACB6] dark:text-[#6D7F8F]",
						isCircleVideo && "text-white",
						(isImageFile || isVideoFile) && !isMessageContent && "text-white"
					)}
				>
					{duration}
				</Typography>

				{isMyMessage && (
					<div className={cn("flex")}>
						<IsRead
							status={message.status as MessageStatus}
							isCircleVideo={isCircleVideo}
							isImageFile={isImageFile}
							isVideoFile={isVideoFile}
							isMessageContent={isMessageContent}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
