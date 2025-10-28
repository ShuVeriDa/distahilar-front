import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { communityService, ICreateCommunity } from "./community.service"

export const useCommunityQuery = (communityId?: string) => {
	// const fetchFoldersQuery = useQuery({
	// 	queryFn: async () => folderService.fetchFolders(),
	// 	queryKey: ["fetchFolders"],
	// })

	// const fetchFolderQuery = useQuery({
	// 	queryFn: async () => folderService.fetchFolder(folderId!),
	// 	queryKey: ["fetchFolder", folderId],
	// 	enabled: !!folderId,
	// })

	const client = useQueryClient()
	const router = useRouter()
	const locale = useLocale()

	const createCommunityQuery = useMutation({
		mutationFn: (data: ICreateCommunity) =>
			communityService.createCommunity(data),
		mutationKey: ["createCommunityQuery"],
	})

	const leaveCommunityQuery = useMutation({
		mutationFn: () => communityService.leaveCommunity(communityId!),
		mutationKey: ["leaveCommunityQuery", communityId],
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ["messagesWS", communityId],
			})
			client.invalidateQueries({
				queryKey: ["fetchChatsWS"],
			})
			router.replace(`/${locale}/chat/`)
		},
		// No onError handling here; let UI handle
	})

	const deleteCommunityQuery = useMutation({
		mutationFn: () => communityService.deleteCommunity(communityId!),
		mutationKey: ["deleteCommunityQuery", communityId],
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ["messagesWS", communityId],
			})
			client.invalidateQueries({
				queryKey: ["fetchChatsWS"],
			})
			router.replace(`/${locale}/chat/`)
		},
	})

	return useMemo(
		() => ({ createCommunityQuery, leaveCommunityQuery, deleteCommunityQuery }),
		[createCommunityQuery, leaveCommunityQuery, deleteCommunityQuery]
	)
}
