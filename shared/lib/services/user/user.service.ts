import { UserType } from "@/prisma/models"
import { instance } from "../../axios/axios"
import { IChangeSettingsRequest, IEditUserRequest } from "./user.types"

export const userService = {
	async userEdit(data: IEditUserRequest) {
		const response = await instance.patch<UserType>("/users", data)

		return response.data
	},

	async changeSettings(data: IChangeSettingsRequest) {
		const response = await instance.patch<UserType>("/users/settings", data)

		return response.data
	},
}
