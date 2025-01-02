import { ChatRoom } from "@/features/ChatRoom"
import { NextPage } from "next"

interface IChatProps {
	params: { chatId: string; locale: string }
}

const Chat: NextPage<IChatProps> = async ({ params }) => {
	// const { chatId } = useParams() // Fetch route params dynamically
	const { chatId, locale } = await params

	return (
		<div className="w-full h-screen flex dark:bg-[#0E1621] bg-white">
			<ChatRoom chatId={chatId as string} locale={locale} />
		</div>
	)
}
export default Chat
