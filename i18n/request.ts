import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ locale, requestLocale }) => {
	const candidate = locale ?? (await requestLocale)
	const resolvedLocale = hasLocale(routing.locales, candidate)
		? candidate
		: routing.defaultLocale

	console.log({ locale, candidate, resolvedLocale })

	return {
		locale: resolvedLocale,
		messages: (await import(`../public/locales/${resolvedLocale}.json`))
			.default,
	}
})
