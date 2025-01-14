"use client"

import { MessageEnum, MessageStatus, MessageType } from "@/prisma/models"
import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { formatTime } from "@/shared/lib/utils/formatTime"
import { IsRead } from "@/shared/ui/isRead"

import { FC, useEffect, useRef, useState } from "react"
import { MessageVoice } from "../MessageVoice"
import { VideoMessage } from "../VideoMessage"

interface IMessageProps {
	message: MessageType
	previousMessage: MessageType
	nextMessage: MessageType
	userId: string | undefined
	locale: string
}

export const Message: FC<IMessageProps> = ({
	message,
	userId,
	previousMessage,
	nextMessage,
	locale,
}) => {
	const [height, setHeight] = useState<number | null>(null)
	const ref = useRef<HTMLDivElement>(null)

	const date = formatTime(message.createdAt, "hh:mm")

	useEffect(() => {
		if (ref.current) {
			setHeight(ref.current.offsetHeight)
		}
	}, [message])

	const isMyMessage = message.userId === userId
	const isNextMessageMine = nextMessage && nextMessage.userId === userId
	const isMoreTwoLine = height && height > 36
	const isVoice = message.messageType === MessageEnum.VOICE
	const isCircleVideo = message.messageType === MessageEnum.VIDEO
	const isFirstMessageOfDay =
		!previousMessage ||
		new Date(message.createdAt).toDateString() !==
			new Date(previousMessage.createdAt).toDateString()

	const formattedDate = formatTime(message.createdAt, "Month number", locale)

	return (
		<>
			{isFirstMessageOfDay && (
				<div className="w-full flex items-center justify-center ">
					<Typography
						tag="h6"
						className="bg-black/20 text-white font-[400] px-3 py-0.5 rounded-full text-[14px]"
					>
						{formattedDate}
					</Typography>
				</div>
			)}
			<div
				ref={ref}
				className={cn(
					"relative w-fit px-3 py-2 flex max-w-[70%] gap-3",
					isMyMessage && "bg-[#EFFDDE] rounded-l-2xl self-end",
					isMyMessage &&
						!isNextMessageMine &&
						"rounded-tr-[16px] after:-right-[20px] after:rounded-bl-[13px] after:shadow-[-13px_0_0_0_#EFFDDE]",
					isMyMessage && isNextMessageMine && "rounded-tr-2xl rounded-br-md",

					!isMyMessage && "bg-white rounded-r-2xl self-start",
					!isMyMessage &&
						isNextMessageMine &&
						"rounded-tl-[13px] after:-left-[20px]  after:rounded-br-[13px] after:shadow-[13px_0_0_0_#ffffff]",
					"after:absolute after:w-[20px] after:h-[13px] after:bottom-0 after:transparent",
					!isMyMessage &&
						!isNextMessageMine &&
						"rounded-tl-[16px] rounded-bl-md ",
					nextMessage &&
						message &&
						(nextMessage.userId === userId) === (message.userId === userId)
						? "mb-1"
						: "mb-3",
					isMoreTwoLine && `flex-col gap-0 pb-5`,
					isVoice && "pb-2",
					isCircleVideo && "bg-transparent after:hidden"
				)}
			>
				<div>
					{message.content && !isVoice && (
						<Typography tag="p" className="text-[14px] leading-5">
							{message.content}
						</Typography>
					)}
					{isVoice && <MessageVoice voice={message.voiceMessages} />}
					{isCircleVideo && <VideoMessage video={message.videoMessages} />}
				</div>

				<div
					className={cn(
						"h-full flex items-end  relative",
						isMoreTwoLine && "justify-end absolute bottom-2 right-[12px]",
						isVoice && "absolute bottom-2"
					)}
				>
					<div
						className={cn(
							" flex gap-1.5 items-center relative top-1.5 ",
							isCircleVideo &&
								"bg-green-900/30 py-0.5 px-1.5 rounded-md absolute top-[230px]"
						)}
					>
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
			</div>
		</>
	)
}
