export enum EnumModel {
	CHANNEL = "CHANNEL",
	GROUP = "GROUP",
	CONTACTS = "CONTACTS",
	SETTINGS = "SETTINGS",
	ACCOUNT = "ACCOUNT",
	FOLDERS = "FOLDERS",
	EDIT_FOLDER = "EDIT_FOLDER",
	LANGUAGE = "LANGUAGE",
	NO_TYPE = "NO_TYPE",
}

export interface IModalData {
	folderEdit: {
		id: string
	}
}

export interface IModelSlice {
	stack: {
		type: EnumModel | null
		data?: IModalData | null
		priority: number
	}[]
}
