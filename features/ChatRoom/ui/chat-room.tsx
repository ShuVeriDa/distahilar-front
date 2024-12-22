import { FC } from "react"

interface IChatRoomProps {}

export const ChatRoom: FC<IChatRoomProps> = () => {
	return (
		<div className="w-full h-screen overflow-y-auto flex flex-col dark:bg-[#0E1621] bg-slate-100">
			Chat
		</div>
	)
}
