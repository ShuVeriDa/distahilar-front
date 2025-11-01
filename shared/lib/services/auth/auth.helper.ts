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
	const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost"
	const isSecure = process.env.NEXT_PUBLIC_COOKIE_SECURE === "true"

	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: cookieDomain,
		sameSite: isSecure ? "none" : "strict", // будет работать только на этом domain
		secure: isSecure,
		expires: new Date(Date.now() + 60 * 60 * 1000), //длительность 1 день, лучше ставить 1 час
	})
}

export const removeFromStorage = () => {
	const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost"

	Cookies.remove(EnumTokens.ACCESS_TOKEN, {
		domain: cookieDomain,
	})
}

export const saveLanguageToCookie = (language: string) => {
	const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost"

	Cookies.set(LANGUAGE_COOKIE_NAME, language.toLowerCase(), {
		domain: cookieDomain,
		sameSite: "strict",
		expires: 365, // Сохраняем на год
	})
}

export const getLanguageFromCookie = (): string | null => {
	return Cookies.get(LANGUAGE_COOKIE_NAME) || null
}

export const removeLanguageFromCookie = () => {
	const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost"

	Cookies.remove(LANGUAGE_COOKIE_NAME, {
		domain: cookieDomain,
	})
}
