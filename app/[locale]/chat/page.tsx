import { Typography } from "@/shared/ui/Typography/Typography"
import { NextPage } from "next"

interface IChatProps {}

const Chat: NextPage<IChatProps> = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center dark:bg-[#0E1621] bg-white bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-cente">
			<div>
				<Typography
					tag="p"
					className="text-[14px] text-white bg-black/25 py-0.5 px-2 rounded-full"
				>
					Select a chat to start messaging
				</Typography>
			</div>
		</div>
	)
}
export default Chat
