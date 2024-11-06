export type ModelType = "channel" | "group" | "contacts" | "settings" | null

export interface IModalData {}

export interface IModelSlice {
	type: ModelType | null
	isOpen: boolean
	data?: IModalData | null
}
