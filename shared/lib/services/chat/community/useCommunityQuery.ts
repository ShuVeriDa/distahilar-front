import { useMutation, useQueryClient } from "@tanstack/react-query"
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

	const createCommunityQuery = useMutation({
		mutationFn: (data: ICreateCommunity) =>
			communityService.createCommunity(data),
		mutationKey: ["createCommunityQuery"],
	})

	return useMemo(() => ({ createCommunityQuery }), [createCommunityQuery])
}
