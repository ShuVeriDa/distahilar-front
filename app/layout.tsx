import { Providers } from "@/shared/providers/providers"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.scss"

const robotoMono = Roboto({
	weight: ["100", "300", "400", "500", "700", "900"],
	subsets: ["latin"],
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
			<body className={`${robotoMono.className} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
