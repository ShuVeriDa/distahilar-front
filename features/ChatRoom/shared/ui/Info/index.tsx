import { ChatMemberType, ChatRole, ChatType } from "@/prisma/models"
import { Typography, useUser } from "@/shared"
import { useFormatLastSeen } from "@/shared/lib/utils/formatLastSeen"
import { FC } from "react"

interface IInfoProps {
	chat: ChatType | undefined
}

export const Info: FC<IInfoProps> = ({ chat }) => {
	const { user } = useUser()
	const userInfo = chat?.members.find(
		(m: ChatMemberType) => m.userId !== user?.id
	)?.user

	const isDialog = chat?.type === ChatRole.DIALOG

	const name = isDialog ? userInfo?.name : chat?.name
	const lastSeen = useFormatLastSeen(userInfo?.lastSeen)

	const online = userInfo?.isOnline
		? "online"
		: `${userInfo?.lastSeen ? lastSeen : " "}`

	const onlineOrFollowers = isDialog
		? online
		: `${chat?.members.length} subscribers `

	return (
		<div className="w-full flex flex-col">
			<div>
				<Typography tag="h6" className="font-normal">
					{name}
				</Typography>
			</div>
			<div>
				<Typography tag="p" className="text-[13px] !font-normal text-[#999999]">
					{onlineOrFollowers}
				</Typography>
			</div>
		</div>
	)
}
