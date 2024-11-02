import { NextRequest, NextResponse } from "next/server"
import { EnumTokens } from "./shared/lib/services/auth/auth.helper"

export async function middleware(request: NextRequest) {
	const refreshToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value

	if (
		refreshToken &&
		(request.nextUrl.pathname === "/auth" || request.nextUrl.pathname === "/")
	) {
		return NextResponse.redirect(new URL("/chat", request.url))
	}

	if (!refreshToken && request.nextUrl.pathname !== "/auth") {
		return redirectToLogin(request)
	}

	return NextResponse.next()
}

const redirectToLogin = (request: NextRequest) => {
	return NextResponse.redirect(new URL("/auth", request.url))
}

export const config = {
	// Protects all routes, including api/trpc.
	// See https://clerk.com/docs/references/nextjs/auth-middleware
	// for more information about configuring your Middleware
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
