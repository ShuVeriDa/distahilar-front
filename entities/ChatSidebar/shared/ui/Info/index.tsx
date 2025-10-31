import { ChatRole, ChatType } from "@/prisma/models"
import { Button, Typography, useModal } from "@/shared"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { CopyClipboard } from "@/features/CopyClipboard"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"
import { FiInfo } from "react-icons/fi"

interface IChatSidebarInfoProps {
	chat: ChatType | undefined
	phone: string | undefined
	bio: string | null | undefined
	username: string | undefined
}

export const ChatSidebarInfo: FC<IChatSidebarInfoProps> = ({
	chat,
	bio,
	phone,
	username,
}) => {
	const isDialog = chat?.type === ChatRole.DIALOG
	const t = useTranslations("COMMON")
	const { onOpenModal } = useModal()

	const infoObj = useMemo(
		() => [
			{
				value: isDialog ? phone : chat?.link,
				description: isDialog ? t("MOBILE") : t("LINK"),
			},
			{
				value: isDialog ? bio : chat?.description,
				description: isDialog ? t("BIO_INFO") : t("DESCRIPTION"),
			},
			{
				value: isDialog ? `@${username}` : undefined,
				description: isDialog ? t("USERNAME") : undefined,
			},
		],
		[chat?.description, chat?.link, isDialog, bio, phone, username, t]
	)

	return (
		<div className="w-full flex gap-8 px-5 py-4">
			<div>
				<FiInfo size={23} color="#444444" />
			</div>
			<div className="flex flex-col gap-2">
				{infoObj.map((item, index) => {
					return (
						<div className="flex flex-col gap-0" key={index + infoObj.length}>
							<div>
								{index === 2 && isDialog ? (
									<CopyClipboard
										className="text-[#47A2D7] dark:text-[#47A2D7]"
										username={username}
									/>
								) : (
									<Typography
										tag="p"
										className="text-[13px] text-[#444444] dark:text-white"
									>
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
					)
				})}
				{chat &&
					(chat.type === ChatRole.GROUP || chat.type === ChatRole.CHANNEL) && (
						<div className="pt-2">
							<Button
								variant="clean"
								className="w-full !justify-start gap-8 p-0 flex items-center cursor-pointer px-5 py-2 text-[#47A2D7] dark:text-[#47A2D7] text-[13px] capitalize hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C]"
								onClick={() =>
									onOpenModal(EnumModel.MEMBERS, {
										members: { chatId: chat.id },
									})
								}
							>
								{chat.type === ChatRole.GROUP ? t("MEMBERS") : t("SUBSCRIBERS")}
							</Button>
						</div>
					)}
			</div>
		</div>
	)
}

