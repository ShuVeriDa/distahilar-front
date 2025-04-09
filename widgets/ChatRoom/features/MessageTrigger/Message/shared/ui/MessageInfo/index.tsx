import { MessageStatus, MessageType } from "@/prisma/models"
import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { formatTime } from "@/shared/lib/utils/formatTime"
import { IsRead } from "@/shared/ui/isRead"
import { FC } from "react"
import { TiPin } from "react-icons/ti"

interface IMessageInfoProps {
	message: MessageType
	isCircleVideo: boolean
	isMoreTwoLine: boolean | 0 | null
	isMyMessage: boolean
	isVoice: boolean
	isHasReactions: boolean
}

export const MessageInfo: FC<IMessageInfoProps> = ({
	message,
	isCircleVideo,
	isMoreTwoLine,
	isMyMessage,
	isVoice,
	isHasReactions,
}) => {
	const date = formatTime(message.createdAt, "hh:mm")
	const isPinned = message.isPinned

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
			{isHasReactions && (
				<div className=" flex gap-1 relative top-1.5">
					<div
						className={cn(
							"flex items-center justify-center gap-0.5  rounded-full p-0.5 text-[15px] ",
							isMyMessage ? "bg-[#dcf8da]" : "bg-[#E8F5FC]"
						)}
					>
						<span>👍</span>
						<span
							className={cn(
								"text-[12px] pr-2 ",
								isMyMessage ? "text-[#6DB566]" : "text-[#168ACD]"
							)}
						>
							7
						</span>
					</div>
				</div>
			)}
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
					<TiPin size={20} color={isMyMessage ? "#6DB566" : "#A0ACB6"} />
				)}
				<Typography
					tag="p"
					className={cn(
						"text-[12px] leading-5",
						isMyMessage ? "text-[#6DB566]" : "text-[#A0ACB6]",
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
