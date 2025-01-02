import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { locales, routing } from "./i18n/routing"
import { EnumTokens } from "./shared/lib/services/auth/auth.helper"

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
		new URL(`/${getDefaultLanguage(request)}/auth`, request.url)
	)
}

const getDefaultLanguage = (request: NextRequest): string => {
	// Определяем язык по заголовкам запроса или используем 'en' по умолчанию
	const acceptLanguage = request.headers.get("accept-language")

	return acceptLanguage?.split(",")[0].split("-")[0] || "en"
}

export const config = {
	// Сопоставляем маршруты для интернационализации и защиты
	matcher: [
		"/",
		"/:lang(ru|en|che)", // ? делает сегмент необязательным
		"/:lang(ru|en|che)/:path*",
		"/:lang(ru|en|che)/((?!.+\\.[\\w]+$|_next).*)",
		"/:lang(ru|en|che)/(api|trpc)(.*)",
	],
}
