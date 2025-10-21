import { MessageEnum, MessageType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { usePinMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { FiX } from "react-icons/fi"

interface IPinnedMessageProps {
	pinnedMessages: MessageType | undefined
}

export const PinnedMessage: FC<IPinnedMessageProps> = ({ pinnedMessages }) => {
	const { mutateAsync: pinMessage } = usePinMessage(
		pinnedMessages?.chatId || ""
	)
	const t = useTranslations("CHAT")

	const handleUnpin = () => {
		if (pinnedMessages) {
			pinMessage({
				chatId: pinnedMessages.chatId,
				messageId: pinnedMessages.id,
			})
		}
	}

	return (
		<Button
			variant="default"
			className={cn(
				"!w-full min-h-[50px] hidden !justify-between  !items-start bg-white dark:bg-[#1B2734] py-2 px-3 border-b border-b-[#E7E7E7] dark:border-b-[#101921]"
			)}
		>
			<div className="flex flex-col">
				<div>
					<Typography
						tag="p"
						className="text-[14px] font-[500] text-[#168ADE] text-start"
					>
						{t("PINNED_MESSAGE")}
					</Typography>
				</div>
				<div>
					<Typography
						tag="p"
						className={cn(
							"!font-[400] text-[12px] text-[#A0ACB6] dark:text-white text-left",
							pinnedMessages?.messageType === MessageEnum.TEXT && "text-black"
						)}
					>
						{pinnedMessages?.messageType === MessageEnum.TEXT &&
							pinnedMessages?.content}
						{pinnedMessages?.messageType === MessageEnum.VOICE &&
							t("VOICE_MESSAGE")}
						{pinnedMessages?.messageType === MessageEnum.VIDEO &&
							t("VIDEO_MESSAGE")}
					</Typography>
				</div>
			</div>
			<div className="h-full w-10 flex ">
				<div
					role="button"
					tabIndex={0}
					className="w-full h-full flex items-center justify-center"
					onClick={handleUnpin}
				>
					<FiX
						size={20}
						color=""
						className="text-[#8A8A8A] hover:text-[#747474]"
					/>
				</div>
			</div>
		</Button>
	)
}
