import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { locales, routing } from "./i18n/routing"
import {
	EnumTokens,
	LANGUAGE_COOKIE_NAME,
} from "./shared/lib/services/auth/auth.helper"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Пропускаем API routes, статические файлы и служебные пути
	if (
		pathname.startsWith("/api") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/_vercel") ||
		pathname.includes(".")
	) {
		return NextResponse.next()
	}

	// Получаем access token из cookies
	const accessToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value

	// Проверяем, является ли путь страницей авторизации
	const isAuthPage = locales.some(
		lang => pathname === `/${lang}/auth` || pathname === `/${lang}/auth/`
	)

	// Проверяем, является ли путь корневым или локализованным корневым
	const isRootPath =
		pathname === "/" ||
		locales.some(lang => pathname === `/${lang}` || pathname === `/${lang}/`)

	// Если пользователь авторизован и пытается зайти на auth или корень - редиректим в chat
	if (accessToken && (isRootPath || isAuthPage)) {
		const redirectUrl = new URL(
			`/${getDefaultLanguage(request)}/chat`,
			request.url
		)
		return NextResponse.redirect(redirectUrl, { status: 302 })
	}

	// Если пользователь не авторизован и пытается зайти не на auth - редиректим на auth
	if (!accessToken && !isAuthPage && !isRootPath) {
		const redirectUrl = new URL(
			`/${getLanguageForRedirect(request)}/auth`,
			request.url
		)
		return NextResponse.redirect(redirectUrl, { status: 302 })
	}

	// Применяем middleware от next-intl для обработки локализации
	return intlMiddleware(request)
}

const getLanguageForRedirect = (request: NextRequest): string => {
	// Сначала проверяем сохраненный язык в cookie
	const savedLanguage = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value

	if (savedLanguage && locales.includes(savedLanguage)) {
		return savedLanguage
	}

	// Если нет сохраненного языка, определяем по заголовкам запроса
	const acceptLanguage = request.headers.get("accept-language")
	const browserLanguage = acceptLanguage
		?.split(",")[0]
		.split("-")[0]
		?.toLowerCase()

	// Проверяем, поддерживается ли язык браузера
	if (browserLanguage && locales.includes(browserLanguage)) {
		return browserLanguage
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
