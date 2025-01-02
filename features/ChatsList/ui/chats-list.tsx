"use client"

import { useFolder } from "@/shared/hooks/useFolder"
import { useFetchChatsQuery } from "@/shared/lib/services/chat/useChatQuery"
import { Search } from "@/widgets/Search"
import { ChangeEvent, FC, useState } from "react"
import { Chats } from "../entities/Chats"

interface IChatsProps {
	locale: string
}

export const ChatsList: FC<IChatsProps> = ({ locale }) => {
	const [query, setQuery] = useState<string>("")

	// Используем кастомный хук useChatsQuery
	const {
		data: chatsData,
		isLoading: isLoadingChats,
		isSuccess: isSuccessChats,
	} = useFetchChatsQuery(query)

	const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
		setQuery(e.currentTarget.value)
	}

	const { currentFolder } = useFolder()

	const chats =
		query.length > 0 && isSuccessChats ? chatsData : currentFolder?.chats

	return (
		// min-w-[250px] max-w-[470px]
		<div className="min-w-[250px] max-w-[350px] w-full h-screen dark:bg-[#17212B] border-r-[1px] dark:border-r-[#18222d] overflow-hidden">
			<div className="w-full h-[50px] flex items-center justify-center px-3">
				<Search
					variant="searchV2"
					value={query}
					onChange={handleSearch}
					placeholder="Search"
					className="placeholder:text-[#6D7883]"
				/>
			</div>

			<Chats
				chats={chats}
				isLoading={isLoadingChats}
				query={query}
				locale={locale}
			/>
		</div>
	)
}
