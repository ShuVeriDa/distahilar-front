import { FolderType } from "@/prisma/models"
import { getFolderUrl } from "../../axios/api.config"
import { instance } from "../../axios/axios"

export interface IFolderData {
	folderId: string
	chatIds: string[]
}

export interface ICreateFolder {
	folderName: string
	imageUrl: string
}

export interface IUpdateFolder {
	folderName?: string
	imageUrl?: string
}

export const folderService = {
	async fetchFolders() {
		const { data } = await instance.get<FolderType[]>(getFolderUrl(""))

		return data
	},

	async fetchFolder(folderId: string) {
		const { data } = await instance.get<FolderType>(
			getFolderUrl(`/${folderId}`)
		)

		return data
	},

	async createFolder(data: ICreateFolder) {
		const res = await instance.post<FolderType>(getFolderUrl(""), data)

		return res.data
	},

	async addChatToFolder(data: IFolderData) {
		const res = await instance.patch<FolderType>(
			getFolderUrl("/add-chat"),
			data
		)

		return res.data
	},

	async deleteChatFromFolder(data: IFolderData) {
		const res = await instance.delete<string>(getFolderUrl(`/remove-chat`), {
			data,
		})

		return res.data
	},

	async updateFolder(folderId: string, data: IUpdateFolder) {
		const res = await instance.patch<FolderType>(getFolderUrl(`/${folderId}`), {
			data,
		})

		return res.data
	},

	async deleteFolderById(folderId: string) {
		const res = await instance.delete<string>(getFolderUrl(`/${folderId}`))

		return res.data
	},
}
