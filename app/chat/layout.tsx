import { LeftBar } from "@/widgets/LeftBar"
import { NextPage } from "next"
import { ReactNode } from "react"

interface IChatLayoutProps {
	children: ReactNode
}

const ChatLayout: NextPage<IChatLayoutProps> = ({ children }) => {
	return (
<<<<<<< HEAD
		<div className="w-screen h-screen flex  ">
			<LeftBar />
=======
		<div className="w-screen h-screen flex">
			<LeftBar />
			dsadas
>>>>>>> 322ac8b6f85eaa05ec569855eab495147caa8f64
			{children}
		</div>
	)
}
export default ChatLayout
