"use client"

import { Chats } from "@/entities/Chat"
import { useFolder } from "@/shared/hooks/useFolder"
import {
	useFetchChatsWSQuery,
	useSearchChatsQuery,
} from "@/shared/lib/services/chat/useChatQuery"
import { Search } from "@/widgets/Search"
import { useTranslations } from "next-intl"
import { ChangeEvent, FC, useState } from "react"

interface IChatsProps {
	locale: string
}

export const ChatsList: FC<IChatsProps> = ({ locale }) => {
	const [query, setQuery] = useState<string>("")
	const t = useTranslations("COMMON")

	// Используем кастомный хук useChatsQuery
	const {
		data: foundChats,
		isLoading: isLoadingFoundChats,
		isSuccess: isSuccessFoundChats,
	} = useSearchChatsQuery(query)

	const { currentFolder } = useFolder()

	const { data: fetchedChats, isLoading: isLoadingFetchedChats } =
		useFetchChatsWSQuery(currentFolder?.name ?? "All chats")

	const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
		setQuery(e.currentTarget.value)
	}

	const chats =
		query.length > 0 && isSuccessFoundChats ? foundChats : fetchedChats

	return (
		// min-w-[250px] max-w-[470px]
		<div className="min-w-[250px] max-w-[350px] w-full h-screen dark:bg-[#17212B] border-r-[1px] dark:border-r-[#101921] overflow-hidden">
			<div className="w-full h-[50px] flex items-center justify-center px-3">
				<Search
					variant="searchV2"
					value={query}
					onChange={handleSearch}
					placeholder={t("SEARCH")}
					className="placeholder:text-[#6D7883]"
				/>
			</div>

			<Chats
				chats={chats}
				isLoading={isLoadingFoundChats || isLoadingFetchedChats}
				query={query}
				locale={locale}
			/>
		</div>
	)
}
