import { FC, ReactNode } from "react"

interface IMainLayoutProps {
	children: ReactNode
}

export const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
	return <div>{children}</div>
}
