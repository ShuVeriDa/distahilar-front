import { ChatsList } from "@/features"
import { NextPage } from "next"

interface IChatProps {}

const Chat: NextPage<IChatProps> = () => {
	return (
		<div className="w-full h-screen dark:bg-[#0E1621] bg-white">
			<ChatsList />
		</div>
	)
}
export default Chat
