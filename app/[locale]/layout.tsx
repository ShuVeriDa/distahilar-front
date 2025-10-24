import { routing } from "@/i18n/routing"
import { Providers } from "@/shared/providers/providers"
import { ReactScan } from "@/widgets/ReactScan"
import type { Metadata } from "next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages } from "next-intl/server"
import { Roboto } from "next/font/google"
import { notFound } from "next/navigation"
import "./globals.scss"

const robotoMono = Roboto({
	weight: ["100", "300", "400", "500", "700", "900"],
	subsets: ["latin"],
})

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }))
}

export const metadata: Metadata = {
	title: "Distahilar",
	description: "Created by shuverida",
}

export default async function RootLayoutRootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: { locale: string }
}>) {
	const { locale } = params
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	const messages = await getMessages({ locale })

	return (
		<html lang={locale} className="light" style={{ colorScheme: "light" }}>
			<head>
				<ReactScan />
			</head>
			<body className={`${robotoMono.className} antialiased`}>
				<NextIntlClientProvider messages={messages}>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
