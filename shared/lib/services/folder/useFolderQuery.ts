import { ChatType } from "@/prisma/models"
import { IconsRendererType } from "@/shared/ui/IconRenderer/data"
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
	onClick?: (
		chats: ChatType[],
		folderName: string,
		icon: IconsRendererType | string | null
	) => void
) => {
	const fetchFoldersQuery = useQuery({
		queryFn: async () => folderService.fetchFolders(),
		queryKey: ["fetchFolders"],
	})

	const fetchFolderQuery = useQuery({
		queryFn: async () => {
			const data = await folderService.fetchFolder(folderId!)
			if (onClick) onClick(data.chats, data.name, data?.imageUrl)
			return data
		},
		queryKey: ["fetchFolder", folderId],
		enabled: !!folderId,
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
		mutationFn: () => folderService.deleteFolderById(folderId!),
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
