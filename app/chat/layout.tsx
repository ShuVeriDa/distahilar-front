import { LeftBar } from "@/widgets/LeftBar"
import { NextPage } from "next"
import { ReactNode } from "react"

interface IChatLayoutProps {
	children: ReactNode
}

const ChatLayout: NextPage<IChatLayoutProps> = ({ children }) => {
	return (
		<div className="w-screen h-screen flex">
			<LeftBar />
			dsadas
			{children}
		</div>
	)
}
export default ChatLayout
