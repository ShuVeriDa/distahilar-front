import { defineRouting } from "next-intl/routing"

export const locales = ["en", "ru", "che"]

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en", "ru", "che"],

	// Used when no locale matches
	defaultLocale: "en",

	// localeDetection: false,
})
