import { FC, ReactNode } from "react"

interface IMainLayoutProps {
	children: ReactNode
}

export const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
	return <>{children}</>
}
