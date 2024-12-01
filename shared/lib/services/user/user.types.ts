import { UserType } from "@/prisma/models"

export interface IUser {}

export interface IChangeSettingsRequest {
	notifications?: boolean
	language?: UserType["settings"]["language"]
}

export interface IEditUserRequest {
	email?: string
	password?: string
	username?: string
	name?: string
	surname?: string
	phone?: string
	imageUrl?: string
	bio?: string
}
