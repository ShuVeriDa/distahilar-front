import { ChatsList } from "@/features"
import { LeftBar } from "@/widgets/LeftBar"
import { NextPage } from "next"
import { ReactNode } from "react"

interface IChatLayoutProps {
	children: ReactNode
	params: { locale: string }
}

const ChatLayout: NextPage<IChatLayoutProps> = async ({ children, params }) => {
	const { locale } = await params

	return (
		<div className="w-screen h-screen flex">
			<div className="flex">
				<LeftBar />
				<ChatsList locale={locale} />
			</div>
			{children}
		</div>
	)
}
export default ChatLayout
