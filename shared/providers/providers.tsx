import { FC, ReactNode } from "react"
import { MainLayout } from "../layout/MainLayout"
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
			defaultTheme="system"
			enableSystem
			// disableTransitionOnChange
		>
			<TanStackQueryProvider>
				<SocketProvider>
					<StoreProvider>
						<ModalProvider />
						<MainLayout>{children}</MainLayout>
					</StoreProvider>
				</SocketProvider>
			</TanStackQueryProvider>
		</ThemeProvider>
	)
}
