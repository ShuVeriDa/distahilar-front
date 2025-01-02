import { routing } from "@/i18n/routing"
import { Providers } from "@/shared/providers/providers"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Roboto } from "next/font/google"
import { notFound } from "next/navigation"
import "./globals.scss"

const robotoMono = Roboto({
	weight: ["100", "300", "400", "500", "700", "900"],
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Distahilar",
	description: "Created by shuverida",
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: { locale: string }
}>) {
	const { locale } = await params

	if (!routing.locales.includes(locale as string)) {
		notFound()
	}

	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={`${robotoMono.className} antialiased`}>
				<NextIntlClientProvider messages={messages}>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
