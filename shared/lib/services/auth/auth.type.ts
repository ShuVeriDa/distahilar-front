import { UserType } from "@/prisma/models"

export interface IAuthResponse {
	accessToken: string
	user: UserType
}

export interface ILoginFormData {
	username: string
	password: string
}

export interface IRegisterFormData {
	username: string
	password: string
	email: string
	name: string
	surname: string
	phone: string
	bio?: string
}
