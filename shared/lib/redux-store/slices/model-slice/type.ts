export enum EnumModel {
	CHANNEL = "CHANNEL",
	GROUP = "GROUP",
	CONTACTS = "CONTACTS",
	SETTINGS = "SETTINGS",
	NO_TYPE = "NO_TYPE",
}

export interface IModalData {}

export interface IModelSlice {
	type: EnumModel | null
	isOpen: boolean
	data?: IModalData | null
}
