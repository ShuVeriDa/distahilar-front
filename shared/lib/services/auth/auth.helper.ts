import Cookies from "js-cookie"

export enum EnumTokens {
	"ACCESS_TOKEN" = "accessToken",
	"REFRESH_TOKEN" = "refreshToken",
}

export const LANGUAGE_COOKIE_NAME = "userLanguage"

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: "localhost",
		sameSite: "strict", // будет работать только на этом domain
		expires: new Date(Date.now() + 60 * 60 * 1000), //длительность 1 день, лучше ставить 1 час
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}

export const saveLanguageToCookie = (language: string) => {
	Cookies.set(LANGUAGE_COOKIE_NAME, language.toLowerCase(), {
		domain: "localhost",
		sameSite: "strict",
		expires: 365, // Сохраняем на год
	})
}

export const getLanguageFromCookie = (): string | null => {
	return Cookies.get(LANGUAGE_COOKIE_NAME) || null
}

export const removeLanguageFromCookie = () => {
	Cookies.remove(LANGUAGE_COOKIE_NAME)
}
