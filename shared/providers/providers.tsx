import { LiveGlobalProvider } from "@/shared/providers/LiveProvider"
import { FC, ReactNode } from "react"
import { MainLayout } from "../layout/MainLayout"
import { Toaster } from "../ui/Toast/toaster"
import { ModalProvider } from "./ModalProvider"
import { SocketProvider } from "./SocketProvider"
import StoreProvider from "./StoreProvider"
import { TanStackQueryProvider } from "./TanStackQueryProvider"
import { ThemeProvider } from "./ThemeProvider"

interface IProvidersProps {
	children: ReactNode
}

export const Providers: FC<IProvidersProps> = ({ children }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			// disableTransitionOnChange
		>
			<TanStackQueryProvider>
				<SocketProvider>
					<StoreProvider>
						<ModalProvider />
						<LiveGlobalProvider>
							<MainLayout>{children}</MainLayout>
						</LiveGlobalProvider>
						<Toaster />
					</StoreProvider>
				</SocketProvider>
			</TanStackQueryProvider>
		</ThemeProvider>
	)
}
