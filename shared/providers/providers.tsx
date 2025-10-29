import { LiveGlobalProvider } from "@/shared/providers/LiveProvider"
import { FC, ReactNode } from "react"
import { MainLayout } from "../layout/MainLayout"
import { Toaster } from "../ui/Toast/toaster"
import { EmojiPickerProvider } from "./EmojiPickerProvider"
import { ModalProvider } from "./ModalProvider"
import { SocketProvider } from "./SocketProvider"
import StoreProvider from "./StoreProvider"
import { TanStackQueryProvider } from "./TanStackQueryProvider"
import { ThemeProvider } from "./ThemeProvider"
import { UserStatusUpdatesListener } from "./UserStatusUpdatesListener"

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
						<EmojiPickerProvider>
							<UserStatusUpdatesListener />
							<ModalProvider />
							<LiveGlobalProvider>
								<MainLayout>{children}</MainLayout>
							</LiveGlobalProvider>
							<Toaster />
						</EmojiPickerProvider>
					</StoreProvider>
				</SocketProvider>
			</TanStackQueryProvider>
		</ThemeProvider>
	)
}
