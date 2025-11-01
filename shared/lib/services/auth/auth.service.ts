import { axiosClassic, instance } from "../../axios/axios"
import { removeFromStorage, saveTokenStorage } from "./auth.helper"
import { IAuthResponse, ILoginFormData, IRegisterFormData } from "./auth.type"

export const authService = {
	async login(data: ILoginFormData) {
		const response = await axiosClassic.post<IAuthResponse>("/auth/login", data)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async register(data: IRegisterFormData) {
		const response = await axiosClassic.post<IAuthResponse>(
			"/auth/register",
			data
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async getNewTokens() {
		const response = await axiosClassic.post<IAuthResponse>(
			"/auth/login/access-token"
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async logout() {
		const response = await instance.post<boolean>("/auth/logout")

		if (response.data) removeFromStorage()

		return response
	},
}
