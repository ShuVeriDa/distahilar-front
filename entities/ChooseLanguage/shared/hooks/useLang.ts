import { EnumLanguage, UserType } from "@/prisma/models"
import { useUser } from "@/shared/hooks/useUser"
import { saveLanguageToCookie } from "@/shared/lib/services/auth/auth.helper"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Константа с названиями языков
const langName = {
	EN: {
		tag: EnumLanguage.EN,
		name: "English",
	},
	RU: {
		tag: EnumLanguage.RU,
		name: "Русский",
	},
	CHE: {
		tag: EnumLanguage.CHE,
		name: "Нохчийн",
	},
} as const

export const useLang = () => {
	const { push } = useRouter()

	const { user } = useUser()

	const [language, setLanguage] = useState<
		UserType["settings"]["language"] | undefined
	>(user?.settings.language)

	// Синхронизация состояния с user при изменении
	useEffect(() => {
		if (user?.settings.language) {
			setLanguage(user.settings.language)
		}
	}, [user?.settings.language])

	const { changeSettings } = useUserQuery()
	const { mutateAsync: changeLanguageMutate } = changeSettings

	const handleLanguageChange = async (
		newLanguage: UserType["settings"]["language"]
	) => {
		// Проверяем изменение перед обновлением состояния
		if (language === newLanguage) {
			return
		}

		const previousLanguage = language

		try {
			setLanguage(newLanguage)
			await changeLanguageMutate({ language: newLanguage })
			// Сохраняем язык в cookie для сохранения при возврате на auth
			saveLanguageToCookie(newLanguage)
			push(`/${newLanguage.toLowerCase()}/chat`)
		} catch (error) {
			// В случае ошибки возвращаем предыдущее значение
			setLanguage(previousLanguage)
			console.error("Failed to change language:", error)
		}
	}

	return {
		language,
		handleLanguageChange,
		langName,
	}
}
