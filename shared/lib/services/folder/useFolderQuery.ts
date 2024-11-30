import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import {
	folderService,
	ICreateFolder,
	IFolderData,
	IUpdateFolder,
} from "./folder.service"

export const useFolderQuery = (
	folderId?: string,
	autoFetch: boolean = false
) => {
	const fetchFoldersQuery = useQuery({
		queryFn: async () => folderService.fetchFolders(),
		queryKey: ["fetchFolders"],
	})

	const fetchFolderQuery = useQuery({
		queryFn: async () => folderService.fetchFolder(folderId!),
		queryKey: ["fetchFolder", folderId],
		enabled: !!folderId && autoFetch,
	})

	const client = useQueryClient()

	const createFolderQuery = useMutation({
		mutationFn: (data: ICreateFolder) => folderService.createFolder(data),
		mutationKey: ["createFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})

	const addChatToFolderQuery = useMutation({
		mutationFn: (data: IFolderData) => folderService.addChatToFolder(data),
		mutationKey: ["addChatToFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})

	const deleteChatFromFolderQuery = useMutation({
		mutationFn: (data: IFolderData) => folderService.deleteChatFromFolder(data),
		mutationKey: ["deleteChatFromFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})

	const updateFolderQuery = useMutation({
		mutationFn: (data: IUpdateFolder) =>
			folderService.updateFolder(folderId!, data),
		mutationKey: ["updateFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})

	const deleteFolderByIdQuery = useMutation({
		mutationFn: (folderId: string) => folderService.deleteFolderById(folderId),
		mutationKey: ["deleteFolderByIdQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})

	return useMemo(
		() => ({
			fetchFoldersQuery,
			fetchFolderQuery,
			createFolderQuery,
			addChatToFolderQuery,
			deleteChatFromFolderQuery,
			updateFolderQuery,
			deleteFolderByIdQuery,
		}),
		[
			fetchFoldersQuery,
			fetchFolderQuery,
			createFolderQuery,
			addChatToFolderQuery,
			deleteChatFromFolderQuery,
			updateFolderQuery,
			deleteFolderByIdQuery,
		]
	)
}
