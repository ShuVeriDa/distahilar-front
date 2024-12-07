import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	folderService,
	ICreateFolder,
	IFolderData,
	IUpdateFolder,
} from "./folder.service"

// Хук для запроса списка папок
export const useFetchFolders = () =>
	useQuery({
		queryFn: async () => folderService.fetchFolders(),
		queryKey: ["fetchFolders"],
	})

// Хук для запроса конкретной папки
export const useFetchFolder = (folderId: string) =>
	useQuery({
		queryFn: async () => folderService.fetchFolder(folderId),
		queryKey: ["fetchFolder", folderId],
		enabled: !!folderId,
	})

// Хук для создания папки
export const useCreateFolder = () => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (data: ICreateFolder) => folderService.createFolder(data),
		mutationKey: ["createFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})
}

// Хук для добавления чата в папку
export const useAddChatToFolder = () => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (data: IFolderData) => folderService.addChatToFolder(data),
		mutationKey: ["addChatToFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})
}

// Хук для удаления чата из папки
export const useDeleteChatFromFolder = () => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (data: IFolderData) => folderService.deleteChatFromFolder(data),
		mutationKey: ["deleteChatFromFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})
}

// Хук для обновления папки
export const useUpdateFolder = (folderId?: string) => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (data: IUpdateFolder) =>
			folderService.updateFolder(folderId!, data),
		mutationKey: ["updateFolderQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})
}

// Хук для удаления папки
export const useDeleteFolderById = () => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (folderId: string) => folderService.deleteFolderById(folderId),
		mutationKey: ["deleteFolderByIdQuery"],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchFolders"] })
		},
	})
}
