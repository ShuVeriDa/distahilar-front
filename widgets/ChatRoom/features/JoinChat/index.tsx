import { ChatRole } from "@/prisma/models"
import { Button, Skeleton } from "@/shared"
import { useJoinChatQuery } from "@/shared/lib/services/chat/useChatQuery"

interface IJoinChatProps {
	typeOfChat: ChatRole
	chatLink: string | undefined
	chatId: string | undefined
	isChatLoading: boolean
}

export const JoinChat = ({
	typeOfChat,
	chatLink,
	chatId,
	isChatLoading,
}: IJoinChatProps) => {
	const { mutateAsync: joinChat } = useJoinChatQuery(chatId || "")
	const onJoinChat = async () => {
		if (chatLink) await joinChat({ link: chatLink })
	}
	return (
		<>
			{!isChatLoading ? (
				<div className="w-full h-[47px] flex justify-center items-center bg-white dark:bg-[#17212B] border-t border-t-[#E7E7E7] dark:border-t-[#101921] ">
					<Button
						variant="clean"
						className="w-full h-full text-[14px] font-normal text-[#1689DC] dark:text-[#6AB2F2] hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C]"
						onClick={onJoinChat}
					>
						JOIN {typeOfChat === ChatRole.CHANNEL ? "CHANNEL" : "GROUP"}
					</Button>
				</div>
			) : (
				<JoinChat.Skeleton />
			)}
		</>
	)
}

JoinChat.Skeleton = function JoinChatSkeleton() {
	return (
		<div className="w-full h-[47px] flex justify-center items-center bg-[#F1F1F1] dark:bg-[#202B38] border-t border-t-[#E7E7E7] dark:border-t-[#101921] ">
			<Skeleton className="w-full h-full text-[14px] font-normal text-[#1689DC] dark:text-[#6AB2F2] hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C]" />
		</div>
	)
}
