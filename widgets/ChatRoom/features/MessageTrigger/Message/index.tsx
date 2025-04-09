"use client"

import { MessageType } from "@/prisma/models"
import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"

import { FC, RefObject } from "react"
import { MessageVoice } from "../../MessageVoice"
import { VideoMessage } from "../../VideoMessage"
import { MessageInfo } from "./shared/ui/MessageInfo"

interface IMessageProps {
	message: MessageType
	nextMessage: MessageType
	isCircleVideo: boolean
	isVoice: boolean
	isMyMessage: boolean
	isHasReactions: boolean
	isMoreTwoLine: boolean | 0 | null
	isNextMessageMine: boolean
	ref: RefObject<HTMLDivElement>
	userId: string | undefined
}

export const Message: FC<IMessageProps> = ({
	message,
	nextMessage,
	isCircleVideo,
	isVoice,
	isMoreTwoLine,
	isMyMessage,
	isNextMessageMine,
	isHasReactions,
	ref,

	userId,
}) => {
	return (
		<>
			<div
				ref={ref}
				className={cn(
					"relative min-w-[80px] w-fit px-3 py-2 flex max-w-[70%] gap-3",
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
					// isMoreTwoLine && `flex-col gap-0 pb-5`,
					isMoreTwoLine && `flex-col gap-0 pb-5`,
					isHasReactions && `flex-col gap-2 pb-0`,
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

				<MessageInfo
					message={message}
					isCircleVideo={isCircleVideo}
					isMoreTwoLine={isMoreTwoLine}
					isMyMessage={isMyMessage}
					isHasReactions={isHasReactions}
					isVoice={isVoice}
				/>
			</div>
		</>
	)
}
