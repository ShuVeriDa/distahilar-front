import { ChatRole, FolderType } from "@/prisma/models"
import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared/types/types.type"

export enum EnumModel {
	CHANNEL = "CHANNEL",
	GROUP = "GROUP",
	CONTACTS = "CONTACTS",
	SETTINGS = "SETTINGS",
	ACCOUNT = "ACCOUNT",
	CHANGE_NAME = "CHANGE_NAME",
	CHANGE_PHONE = "CHANGE_PHONE",
	CHANGE_USERNAME = "CHANGE_USERNAME",
	FOLDERS = "FOLDERS",
	EDIT_FOLDER = "EDIT_FOLDER",
	CREATE_FOLDER = "CREATE_FOLDER",
	INCLUDE_CHATS = "INCLUDE_CHATS",
	LANGUAGE = "LANGUAGE",
	NO_TYPE = "NO_TYPE",
	DELETE_MESSAGES = "DELETE_MESSAGES",
}

export interface IModalData {
	folderManage?: {
		folder: FolderType
		isFetching: boolean
	}
	includeChats?: IIncludeChats
	changeInfo?: {
		firstName?: string
		surname?: string
		phone?: string
		username?: string
	}
	deleteMessages: {
		messageIds: string[]
		chatId: string
		interlocutorsName?: string
		chatType: ChatRole
		clearSelectedMessages: () => void
	}
}

export type IIncludeChats = {
	id?: string
	chats?: ICutChat[]
	onAddChatsIds?: (chats: ICutChat[], ids: string[]) => void
	onRemoveChatsIds?: (ids: string[]) => void
}

export interface IModelSlice {
	stack: {
		type: EnumModel | null
		data: IModalData | null
		priority: number
	}[]
	folderManage?: {
		folderNameValue: string
		iconValue: "Folder" | string
		chatsLocale: ICutChat[]
		addedChatsIds: string[]
		deletedChatIds: string[]
	}
}
