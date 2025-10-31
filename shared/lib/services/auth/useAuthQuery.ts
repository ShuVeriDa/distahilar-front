import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux-store/slices/user-slice/userSlice"
import { store } from "../../redux-store/store"
import { saveLanguageToCookie, saveTokenStorage } from "./auth.helper"
import { authService } from "./auth.service"
import { ILoginFormData, IRegisterFormData } from "./auth.type"

export const useAuthQuery = () => {
	const locale = useLocale()
	const dispatch = useDispatch()
	const { push } = useRouter()

	const login = useMutation({
		mutationKey: ["login"],
		mutationFn: async (data: ILoginFormData) => authService.login(data),
		onSuccess: ({ data }) => {
			saveTokenStorage(data.accessToken)
			dispatch(setUser(data.user))
			// Сохраняем язык в cookie
			saveLanguageToCookie(data.user.settings.language)
			push(`/${data.user.settings.language.toLowerCase()}/chat`)
		},
	})

	const register = useMutation({
		mutationKey: ["register"],
		mutationFn: (data: IRegisterFormData) => authService.register(data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			// reset()
			push(`/${locale}/auth`)
		},
	})

	const logout = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess() {
			// Получаем актуальное состояние пользователя из Redux ПЕРЕД очисткой
			const currentState = store.getState()
			const currentUser = currentState.user.user
			const userLanguage =
				currentUser?.settings.language?.toLowerCase() || locale

			// Сохраняем язык в cookie для использования в middleware
			if (currentUser?.settings.language) {
				saveLanguageToCookie(currentUser.settings.language)
			}

			// Очищаем состояние пользователя
			dispatch(setUser(null))

			// Редиректим на auth с сохраненным языком
			push(`/${userLanguage}/auth`)
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
