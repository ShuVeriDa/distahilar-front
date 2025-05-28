import { ChatRole, ChatType, UserType } from "@/prisma/models"
import { Typography } from "@/shared"
import { CopyClickBoard } from "@/widgets/SheetComponent/features/clickboard"
import { FC, useMemo } from "react"
import { FiInfo } from "react-icons/fi"
interface IInfoProps {
	user: UserType | null
	chat: ChatType | undefined
}

export const Info: FC<IInfoProps> = ({ chat, user }) => {
	const isDialog = chat?.type === ChatRole.DIALOG

	const infoObj = useMemo(
		() => [
			{
				value: isDialog ? user?.phone : chat?.link,
				description: isDialog ? "Mobile" : "Link",
			},
			{
				value: isDialog ? user?.bio : chat?.description,
				description: isDialog ? "Bio" : "Description",
			},
			{
				value: isDialog ? `@${user?.username}` : undefined,
				description: isDialog ? "Username" : undefined,
			},
		],
		[
			chat?.description,
			chat?.link,
			isDialog,
			user?.bio,
			user?.phone,
			user?.username,
		]
	)

	return (
		<div className="w-full flex gap-8 px-5 py-4">
			<div>
				<FiInfo size={23} color="#444444" />
			</div>
			<div className="flex flex-col gap-2">
				{infoObj.map((item, index) => (
					<div className="flex flex-col gap-0" key={index + infoObj.length}>
						<div>
							{index === 2 && isDialog ? (
								<CopyClickBoard className="text-[#47A2D7]" />
							) : (
								<Typography tag="p" className="text-[13px] text-[#444444]">
									{item.value}
								</Typography>
							)}
						</div>
						<div>
							<Typography tag="p" className="text-[13px] text-[#999999]">
								{item.description}
							</Typography>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
