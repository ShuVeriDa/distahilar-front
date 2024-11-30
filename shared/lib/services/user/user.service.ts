import { UserType } from "@/prisma/models"
import { instance } from "../../axios/axios"
import { IChangeSettingsRequest } from "./user.types"

export const userService = {
	async changeSettings(data: IChangeSettingsRequest) {
		const response = await instance.patch<UserType>("/users/settings", data)

		return response.data
	},
}
