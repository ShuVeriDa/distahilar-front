import { EnumLanguage, UserType } from "@/prisma/models"
import { useUser } from "@/shared/hooks/useUser"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { useState } from "react"

export const useLang = () => {
	const { user } = useUser()

	const [language, setLanguage] = useState<
		UserType["settings"]["language"] | undefined
	>(user?.settings.language)

	const { changeSettings } = useUserQuery()
	const { mutateAsync: changeLanguageMutate } = changeSettings

	const handleLanguageChange = async (
		newLanguage: UserType["settings"]["language"]
	) => {
		setLanguage(newLanguage)
		if (language !== newLanguage) {
			await changeLanguageMutate({ language: newLanguage })
		}
	}

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
	}

	console.log({ lang: user?.settings.language })

	return {
		language,
		handleLanguageChange,
		langName,
	}
}
