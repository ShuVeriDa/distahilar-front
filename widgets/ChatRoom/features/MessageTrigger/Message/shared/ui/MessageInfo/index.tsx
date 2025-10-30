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
import { FC, useMemo } from "react"
import { TiPin } from "react-icons/ti"
import {
	getMainContainerClasses,
	getTimeContainerClasses,
	getTimeTextClasses,
} from "../../libs/classes"

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
	const { mutateAsync: addReaction } = useAddReaction()

	const computedValues = useMemo(() => {
		const duration = formatTime(message.createdAt, "hh:mm")
		const isPinned = message.isPinned
		const isDialog = message.chat?.type === ChatRole.DIALOG
		const isImageFile = isFile && media?.type === MediaTypeEnum.IMAGE
		const isVideoFile = isFile && media?.type === MediaTypeEnum.VIDEO

		console.log({
			type: message.messageType,
			message: message.content,
			isMoreTwoLine,
			isFile,
			isHasReactions,
			isMessageContent,
		})

		// Вычисляем классы один раз
		const mainContainerClasses = getMainContainerClasses({
			isMoreTwoLine,
			isFile,
			isHasReactions,
			isMessageContent,
			isMyMessage,
			isVoice,
			isImageFile,
			isVideoFile,
		})

		const timeContainerClasses = getTimeContainerClasses({
			isCircleVideo,
			isImageFile,
			isVideoFile,
			isMessageContent,
			isHasReactions,
			isFile,
		})

		const timeTextClasses = getTimeTextClasses({
			isMyMessage,
			isCircleVideo,
			isImageFile,
			isVideoFile,
			isMessageContent,
			isHasReactions,
		})

		return {
			duration,
			isPinned,
			isDialog,
			isImageFile,
			isVideoFile,
			mainContainerClasses,
			timeContainerClasses,
			timeTextClasses,
		}
	}, [
		message.createdAt,
		message.isPinned,
		message.chat?.type,
		isFile,
		media?.type,
		isMoreTwoLine,
		isHasReactions,
		isMessageContent,
		isMyMessage,
		isVoice,
		isCircleVideo,
	])

	const {
		duration,
		isPinned,
		isDialog,
		mainContainerClasses,
		timeContainerClasses,
		timeTextClasses,
		isImageFile,
		isVideoFile,
	} = computedValues

	const pinIconClasses = cn(
		isMyMessage
			? "text-[#6DB566] dark:text-[#488DD3]"
			: "text-[#A0ACB6] dark:text-[#6D7F8F]"
	)

	return (
		<div className={mainContainerClasses}>
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
			<div className={timeContainerClasses}>
				{isPinned && <TiPin size={20} className={pinIconClasses} />}
				<Typography tag="p" className={timeTextClasses}>
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

MessageInfo.displayName = "MessageInfo"
