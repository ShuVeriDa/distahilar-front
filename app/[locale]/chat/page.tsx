import { Typography } from "@/shared/ui/Typography/Typography"
import { NextPage } from "next"

interface IChatProps {}

const Chat: NextPage<IChatProps> = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center dark:bg-[#0E1621] bg-slate-100 bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-center dark:bg-[url('/')] border-r border-r-[#E7E7E7] dark:border-r-[#101921]">
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
