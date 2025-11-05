import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { locales, routing } from "./i18n/routing"
import {
	EnumTokens,
	LANGUAGE_COOKIE_NAME,
} from "./shared/lib/services/auth/auth.helper"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value
	const pathname = request.nextUrl.pathname

	// Извлекаем locale из пути, если он есть
	const pathnameHasLocale = locales.some(
		lang => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
	)
	const locale = pathnameHasLocale
		? locales.find(lang => pathname.startsWith(`/${lang}`)) || "en"
		: null

	// Если пользователь авторизован и пытается зайти на главную или страницу авторизации
	if (accessToken) {
		const isRoot = pathname === "/"
		const isAuthPageWithLocale =
			pathnameHasLocale &&
			locale &&
			(pathname === `/${locale}/auth` || pathname === `/${locale}`)

		if (isRoot || isAuthPageWithLocale) {
			const language = locale || getDefaultLanguage(request)
			return NextResponse.redirect(new URL(`/${language}/chat`, request.url))
		}
	}

	// Если пользователь не авторизован и пытается зайти на защищенные страницы
	if (!accessToken) {
		const isRoot = pathname === "/"
		const isAuthPage =
			pathnameHasLocale && locale && pathname === `/${locale}/auth`

		if (!isAuthPage && !isRoot) {
			return redirectToLogin(request)
		}
	}

	// Применяем next-intl middleware для обработки локализации
	return intlMiddleware(request)
}

const redirectToLogin = (request: NextRequest) => {
	return NextResponse.redirect(
		new URL(`/${getLanguageForRedirect(request)}/auth`, request.url)
	)
}

const getLanguageForRedirect = (request: NextRequest): string => {
	// Сначала проверяем сохраненный язык в cookie
	const savedLanguage = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value

	if (savedLanguage && locales.includes(savedLanguage)) {
		return savedLanguage
	}

	// Если нет сохраненного языка, определяем по заголовкам запроса
	const acceptLanguage = request.headers.get("accept-language")
	if (acceptLanguage) {
		const browserLanguage = acceptLanguage
			.split(",")[0]
			.split("-")[0]
			.toLowerCase()

		// Проверяем, поддерживается ли язык браузера
		if (browserLanguage && locales.includes(browserLanguage)) {
			return browserLanguage
		}
	}

	// Используем 'en' по умолчанию
	return "en"
}

const getDefaultLanguage = (request: NextRequest): string => {
	return getLanguageForRedirect(request)
}

export const config = {
	// Сопоставляем маршруты для интернационализации и защиты
	matcher: [
		"/",
		"/:lang(ru|en|che)", // ? делает сегмент необязательным
		"/:lang(ru|en|che)/:path*",
		"/:lang(ru|en|che)/((?!.+\\.[\\w]+$|_next).*)",
		"/:lang(ru|en|che)/(api|trpc)(.*)",
		"/((?!api|trpc|_next|_vercel|.*\\..*).*)",
	],
}
