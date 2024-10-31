import { cn } from "@/shared/lib/utils/cn"
import { Providers } from "@/shared/providers/providers"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.scss"

const robotoMono = localFont({
	src: "../public/fonts/Roboto-Regular.ttf",
	variable: "--font-geist-sans",
	weight: "400",
})

export const metadata: Metadata = {
	title: "Distahilar",
	description: "Created by shuverida",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={cn(robotoMono.variable, "antialiased")}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
