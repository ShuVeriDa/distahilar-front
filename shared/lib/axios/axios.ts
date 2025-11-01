import axios, { CreateAxiosDefaults } from "axios"
import { getAccessToken, removeFromStorage } from "../services/auth/auth.helper"
import { authService } from "../services/auth/auth.service"
import { errorCatch, getContentType } from "./api.helper"

const axiosOptions: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: getContentType(),
	withCredentials: true,
}

export const axiosClassic = axios.create(axiosOptions)

export const instance = axios.create(axiosOptions)

instance.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

instance.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		const message = errorCatch(error)

		if (
			(error?.response?.status === 401 ||
				message === "jwt expired" ||
				message === "jwt must be provided") &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()
				return instance.request(originalRequest)
			} catch (error) {
				const refreshErrorMessage = errorCatch(error)

				if (
					[
						"jwt expired",
						"Invalid refresh token",
						"Refresh token revoked",
						"Invalid token type",
						"Refresh token not passed",
					].includes(refreshErrorMessage)
				)
					removeFromStorage()
			}
		}

		throw error
	}
)
