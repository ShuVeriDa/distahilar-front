import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux-store/slices/user-slice/userSlice"
import { saveTokenStorage } from "./auth.helper"
import { authService } from "./auth.service"
import { ILoginFormData, IRegisterFormData } from "./auth.type"

export const useAuthQuery = () => {
	const dispatch = useDispatch()
	const { push } = useRouter()

	const login = useMutation({
		mutationKey: ["login"],
		mutationFn: async (data: ILoginFormData) => authService.login(data),
		onSuccess: ({ data }) => {
			saveTokenStorage(data.accessToken)
			dispatch(setUser(data.user))
			push("/")
		},
	})

	const register = useMutation({
		mutationKey: ["register"],
		mutationFn: (data: IRegisterFormData) => authService.register(data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			// reset()
			push("/auth")
		},
	})

	const logout = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess() {
			dispatch(setUser(null))
			// reset()
			push("/auth")
		},
	})

	return useMemo(
		() => ({
			login,
			register,
			logout,
		}),
		[login, register, logout]
	)
}
