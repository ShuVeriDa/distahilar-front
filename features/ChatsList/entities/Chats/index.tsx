import { FoundedChatsType } from "@/prisma/models"
import { FC } from "react"
import { Chat } from "../../shared/ui/Chat"
import { NoResults } from "../../shared/ui/NoResults"
import { StatusSearch } from "../../shared/ui/StatusSearch"

interface IChatsProps {
	chats: FoundedChatsType[] | undefined
	isLoading: boolean
	query: string
	locale: string
}

export const Chats: FC<IChatsProps> = ({ chats, isLoading, query, locale }) => {
	return (
		<div className="w-full h-full flex flex-col overflow-y-auto">
			<StatusSearch chats={chats} isLoading={isLoading} query={query} />
			{isLoading ? (
				<>
					<Chat.Skeleton />
					<Chat.Skeleton />
				</>
			) : chats && chats.length > 0 ? (
				chats.map(chat => (
					<Chat key={chat.chatId} chat={chat} locale={locale} />
				))
			) : (
				<NoResults query={query} />
			)}
		</div>
	)
}
