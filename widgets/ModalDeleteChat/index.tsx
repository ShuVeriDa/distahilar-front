"use client"

import { FC, useState } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ChatRole } from "@/prisma/models"
import { Typography, useModal } from "@/shared"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { useCommunityQuery } from "@/shared/lib/services/chat/community/useCommunityQuery"
import { useDeleteChatQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FaCheck } from "react-icons/fa6"

interface IModalDeleteChatProps {}

export const ModalDeleteChat: FC<IModalDeleteChatProps> = () => {
	const [isDeleteBoth, setIsDeleteBoth] = useState<boolean>(false)
	const onToggleDeleteBoth = () => setIsDeleteBoth(!isDeleteBoth)
	const t = useTranslations("MODALS.DELETE_CHAT")

	const { onClose, currentModal } = useModal()
	const { data } = currentModal
	const chatId = data?.deleteChat?.chatId
	const chatType = data?.deleteChat?.chatType
	const chatName = data?.deleteChat?.chatName
	const interlocutorsAvatar = data?.deleteChat?.interlocutorsAvatar
	const interlocutorsName = data?.deleteChat?.interlocutorsName
	const isOwner = data?.deleteChat?.isOwner

	const { mutateAsync: deleteChat } = useDeleteChatQuery(chatId!)
	const { leaveCommunityQuery, deleteCommunityQuery } =
		useCommunityQuery(chatId)
	const { mutateAsync: leaveCommunity } = leaveCommunityQuery
	const { mutateAsync: deleteCommunity } = deleteCommunityQuery

	const onConfirm = async () => {
		if (!chatId) return
		try {
			if (chatType === ChatRole.DIALOG) {
				await deleteChat({ delete_both: isDeleteBoth })
			} else {
				if (isOwner) {
					await deleteCommunity()
				} else {
					await leaveCommunity()
				}
			}
		} catch (error) {
			console.error(error)
		} finally {
			onClose()
		}
	}

	return (
		<ModalLayout
			onClose={() => {}}
			className="p-0 w-[350px] flex flex-col !gap-2"
			isClickOutside={false}
			translateX={0}
		>
			<div className="flex flex-col gap-5 pt-5 px-5">
				<div className="flex gap-3.5 items-center">
					<div className="w-full h-full max-w-[50px] max-h-[50px]">
						<Image
							src={interlocutorsAvatar ?? "/images/logo.png"}
							width={50}
							height={50}
							alt={`avatar-${interlocutorsName}`}
							className="w-[50px] h-[50px] rounded-full object-cover"
							loading="lazy"
						/>
					</div>

					<div>
						<Typography tag="p" className="text-[18px] ">
							{chatType === ChatRole.DIALOG
								? t("TITLE")
								: chatType === ChatRole.CHANNEL
								? isOwner
									? t("DELETE_CHANNEL_TITLE")
									: t("LEAVE_CHANNEL_TITLE")
								: isOwner
								? t("DELETE_GROUP_TITLE")
								: t("LEAVE_GROUP_TITLE")}
						</Typography>
					</div>
				</div>
				<Typography tag="p" className="text-[15px] ">
					{chatType === ChatRole.DIALOG
						? t("CONFIRMATION", { name: interlocutorsName ?? "" })
						: chatType === ChatRole.CHANNEL
						? isOwner
							? t("DELETE_CHANNEL_CONFIRMATION", { name: chatName ?? "" })
							: t("LEAVE_CHANNEL_CONFIRMATION", { name: chatName ?? "" })
						: isOwner
						? t("DELETE_GROUP_CONFIRMATION", { name: chatName ?? "" })
						: t("LEAVE_GROUP_CONFIRMATION", { name: chatName ?? "" })}
					<br />
					<br />
					{t("CANNOT_UNDONE")}
				</Typography>
				{chatType === ChatRole.DIALOG && (
					<div className="flex gap-3">
						<label className="relative flex gap-3 items-center cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer "
								onChange={onToggleDeleteBoth}
								checked={isDeleteBoth}
							/>
							<div className="w-5 h-5 dark:bg-[#17212B] dark:border-white bg-white border  rounded peer-checked:bg-[#40A7E3] peer-checked:border-blue-500 peer-focus:ring-blue-200 transition-all duration-200 flex items-center justify-center">
								{isDeleteBoth && <FaCheck color="white" size={13} />}
							</div>

							<Typography tag="p" className="text-[15px]">
								{t("ALSO_DELETE_FOR", { name: interlocutorsName ?? "" })}
							</Typography>
						</label>
					</div>
				)}
			</div>

			<ModalFooter
				onClose={onClose}
				onSave={onConfirm}
				isLoading={false}
				type="button"
				anotherName={
					chatType === ChatRole.DIALOG
						? t("DELETE_BUTTON")
						: isOwner
						? t("DELETE_BUTTON")
						: t("LEAVE_BUTTON")
				}
				className="after:h-0"
			/>
		</ModalLayout>
	)
}
