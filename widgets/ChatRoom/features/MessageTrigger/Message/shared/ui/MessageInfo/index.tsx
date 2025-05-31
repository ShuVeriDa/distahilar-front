import {
	ChatRole,
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
	isCircleVideo: boolean
	isMoreTwoLine: boolean | 0 | null
	isMyMessage: boolean
	isVoice: boolean
	isHasReactions: boolean
	userId: string | undefined
}

export const MessageInfo: FC<IMessageInfoProps> = ({
	message,
	isCircleVideo,
	isMoreTwoLine,
	isMyMessage,
	isVoice,
	isHasReactions,
	userId,
}) => {
	const date = formatTime(message.createdAt, "hh:mm")
	const isPinned = message.isPinned
	const isDialog = message.chat?.type === ChatRole.DIALOG

	const { mutateAsync: addReaction } = useAddReaction()

	return (
		<div
			className={cn(
				"h-full flex items-end relative",
				isMoreTwoLine && "justify-end absolute bottom-2 right-[12px]",
				isMyMessage && !isMoreTwoLine && " -right-2 z-[20]",
				isVoice && "absolute bottom-2",
				isHasReactions &&
					"justify-between relative bottom-2 right-[12px] z-[20] pl-2 gap-5"
			)}
		>
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
			<div
				className={cn(
					" flex gap-1.5 items-center relative top-1.5 ",
					isCircleVideo &&
						// "bg-green-900/30 py-0.5 px-1.5 rounded-md absolute top-[230px]",
						"bg-green-900/30 py-0.5 px-1.5 rounded-md absolute",
					isCircleVideo && !isHasReactions && "top-[230px]",
					isHasReactions && "-right-5"
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
						isCircleVideo && "text-white"
					)}
				>
					{date}
				</Typography>

				{isMyMessage && (
					<div className={cn("flex")}>
						<IsRead
							status={message.status as MessageStatus}
							isCircleVideo={isCircleVideo}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
