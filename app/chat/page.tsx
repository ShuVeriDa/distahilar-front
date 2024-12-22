import { ChatsList } from "@/features"
import { ChatRoom } from "@/features/ChatRoom"
import { NextPage } from "next"

interface IChatProps {}

const Chat: NextPage<IChatProps> = () => {
	return (
		<div className="w-full h-screen flex dark:bg-[#0E1621] bg-white">
			<ChatsList />
			<ChatRoom />
		</div>
	)
}
export default Chat
