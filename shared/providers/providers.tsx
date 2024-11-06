import { FC, ReactNode } from "react"
import { MainLayout } from "../layout/MainLayout"
import { ModalProvider } from "./ModalProvider"
import StoreProvider from "./StoreProvider"
import { TanStackQueryProvider } from "./TanStackQueryProvider"
import { ThemeProvider } from "./ThemeProvider"

interface IProvidersProps {
	children: ReactNode
}

export const Providers: FC<IProvidersProps> = ({ children }) => {
	return (
		<TanStackQueryProvider>
			<StoreProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					// disableTransitionOnChange
				>
					<ModalProvider />
					<MainLayout>{children}</MainLayout>
				</ThemeProvider>
			</StoreProvider>
		</TanStackQueryProvider>
	)
}
