import { NextRequest, NextResponse } from "next/server"
import { EnumTokens } from "./shared/lib/services/auth/auth.helper"

export async function middleware(request: NextRequest) {
	const refreshToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value

	if (refreshToken && request.nextUrl.pathname === "/auth") {
		return NextResponse.redirect(new URL("/", request.url))
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
	matcher: ["/", "/auth"],
}
