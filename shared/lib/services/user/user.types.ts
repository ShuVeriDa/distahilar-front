import { UserType } from "@/prisma/models"

export interface IUser {}

export interface IChangeSettingsRequest {
	notifications?: boolean
	language?: UserType["settings"]["language"]
}
