import { FolderType } from "@/prisma/models"
import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared/types/types.type"

export enum EnumModel {
	CHANNEL = "CHANNEL",
	GROUP = "GROUP",
	CONTACTS = "CONTACTS",
	SETTINGS = "SETTINGS",
	ACCOUNT = "ACCOUNT",
	FOLDERS = "FOLDERS",
	EDIT_FOLDER = "EDIT_FOLDER",
	INCLUDE_CHATS = "INCLUDE_CHATS",
	LANGUAGE = "LANGUAGE",
	NO_TYPE = "NO_TYPE",
}

export interface IModalData {
	folderEdit?: {
		folder: FolderType
		isFetching: boolean
	}
	includeChats?: IIncludeChats
}

export type IIncludeChats = {
	id: string
	chats: ICutChat[]
	onAddChatsIds?: (chats: ICutChat[], ids: string[]) => void
	onRemoveChatsIds?: (ids: string[]) => void
}

export interface IModelSlice {
	stack: {
		type: EnumModel | null
		data: IModalData | null
		priority: number
	}[]
}
