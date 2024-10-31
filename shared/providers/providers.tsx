import { FC, ReactNode } from "react"
import { MainLayout } from "../layout/MainLayout"
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
				<MainLayout>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</MainLayout>
			</StoreProvider>
		</TanStackQueryProvider>
	)
}
