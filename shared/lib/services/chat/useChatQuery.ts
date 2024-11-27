import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { chatService } from "./chat.service"

export const useChatQuery = (chatId?: string, params?: string) => {
	const fetchChatsQuery = useQuery({
		queryFn: async () => chatService.searchChat(params),
		queryKey: ["fetchChats", params],
	})

	// const fetchFolderQuery = useQuery({
	// 	queryFn: async () => folderService.fetchFolder(folderId!),
	// 	queryKey: ["fetchFolder", folderId],
	// 	enabled: !!folderId,
	// })

	// const client = useQueryClient()

	return useMemo(() => ({ fetchChatsQuery }), [fetchChatsQuery])
}
