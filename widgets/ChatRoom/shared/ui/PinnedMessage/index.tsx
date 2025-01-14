import { MessageType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { FC } from "react"

interface IPinnedMessageProps {
	pinnedMessages: MessageType | undefined
}

export const PinnedMessage: FC<IPinnedMessageProps> = ({ pinnedMessages }) => {
	return (
		<Button
			variant="default"
			className={cn(
				"w-full min-h-[50px] hidden flex-col  !items-start bg-white py-2 px-3 border-b border-b-[#E7E7E7]"
			)}
		>
			<div>
				<Typography tag="p" className="text-[14px] font-[500] text-[#168ADE]">
					Pinned Message
				</Typography>
			</div>
			<div>
				<Typography tag="p" className="!font-[400] text-[14px]">
					{pinnedMessages?.content}
				</Typography>
			</div>
		</Button>
	)
}
