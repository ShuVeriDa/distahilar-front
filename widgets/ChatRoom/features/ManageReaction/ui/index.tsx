import { ReactionTypeFromMessage } from "@/prisma/models"
import { CreateReactionDto } from "@/shared/lib/services/message/useReactionQuery"
import { cn } from "@/shared/lib/utils/cn"
import { UseMutateAsyncFunction } from "@tanstack/react-query"
import Image from "next/image"

import { FC } from "react"

interface IManageReactionProps {
	userId: string | undefined
	chatId: string
	isDialog: boolean
	isMyMessage: boolean
	reaction: ReactionTypeFromMessage
	addReaction: UseMutateAsyncFunction<void, Error, CreateReactionDto, unknown>
}

export const ManageReaction: FC<IManageReactionProps> = ({
	isDialog,
	chatId,
	isMyMessage,
	reaction,
	userId,
	addReaction,
}) => {
	const isMyReaction = reaction.userId === userId

	const onHandleClick = () => {
		addReaction({
			chatId: chatId,
			messageId: reaction.messageId,
			emoji: reaction.emoji,
		})
	}

	return (
		<div
			className=" flex gap-1 relative top-1.5"
			role="button"
			tabIndex={0}
			aria-pressed={isMyReaction}
			onClick={onHandleClick}
		>
			<div
				className={cn(
					"flex items-center justify-center gap-0.5  rounded-full px-0.5 text-[15px] ",
					isDialog && isMyMessage && isMyReaction && "bg-[#5FBE67]",
					isDialog && isMyMessage && !isMyReaction && "bg-[#D5F1C9]",
					isDialog && !isMyMessage && isMyReaction && "bg-[#40A7E3]",
					isDialog && !isMyMessage && !isMyReaction && "bg-[#E8F5FC]",
					!isDialog && isMyReaction && "bg-[#40A7E3]",
					!isDialog && !isMyReaction && "bg-[#E8F5FC]"
				)}
			>
				<span>{reaction.emoji}</span>

				{reaction.count > 1 ? (
					<span
						className={cn(
							"text-[12px] pr-2 ",
							isMyMessage ? "text-[#f9faf9]" : "text-[#168ACD]"
						)}
					>
						{reaction.count}
					</span>
				) : (
					<div>
						<Image
							src={reaction.user.imageUrl ?? "/images/no-avatar.png"}
							alt={reaction.emoji}
							width={20}
							height={20}
							className="rounded-full"
						/>
					</div>
				)}
			</div>
		</div>
	)
}
