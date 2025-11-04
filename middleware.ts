import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { locales, routing } from "./i18n/routing"
import {
	EnumTokens,
	LANGUAGE_COOKIE_NAME,
} from "./shared/lib/services/auth/auth.helper"

export default createMiddleware(routing)

export async function middleware(request: NextRequest) {
	const refreshToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value

	if (
		refreshToken &&
		(request.nextUrl.pathname === "/" ||
			locales.some(lang => request.nextUrl.pathname === `/${lang}/auth`) ||
			locales.some(lang => request.nextUrl.pathname === `/${lang}`))
	) {
		return NextResponse.redirect(
			new URL(`/${getDefaultLanguage(request)}/chat`, request.url)
		)
	}

	if (
		!refreshToken &&
		!locales.some(lang => request.nextUrl.pathname === `/${lang}/auth`)
	) {
		return redirectToLogin(request)
	}

	return NextResponse.next()
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
