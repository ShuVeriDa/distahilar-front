"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FC, ReactNode, useState } from "react"

interface ITanStackQueryProviderProps {
	children: ReactNode
}

export const TanStackQueryProvider: FC<ITanStackQueryProviderProps> = ({
	children,
}) => {
	const [client] = useState(new QueryClient())

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
