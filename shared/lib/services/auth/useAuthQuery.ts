import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { saveTokenStorage } from "./auth.helper"
import { authService } from "./auth.service"
import { ILoginFormData, IRegisterFormData } from "./auth.type"

export const useAuthQuery = () => {
	const { push } = useRouter()

	const login = useMutation({
		mutationKey: ["login"],
		mutationFn: async (data: ILoginFormData) => authService.login(data),
		onSuccess: ({ data }) => {
			saveTokenStorage(data.accessToken)

			push("/")
		},
	})

	const register = useMutation({
		mutationKey: ["register"],
		mutationFn: (data: IRegisterFormData) => authService.register(data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			// reset()
			push("/sign-in")
		},
	})

	return useMemo(
		() => ({
			login,
			register,
		}),
		[login, register]
	)
}
