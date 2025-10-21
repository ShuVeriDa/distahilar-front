"use client"

import { FC, useState } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ChatRole } from "@/prisma/models"
import { Typography, useModal } from "@/shared"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { useDeleteMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { useTranslations } from "next-intl"
import { FaCheck } from "react-icons/fa6"

interface IModalDeleteMessagesProps {}

export const ModalDeleteMessages: FC<IModalDeleteMessagesProps> = () => {
	const [isDeleteBoth, setIsDeleteBoth] = useState<boolean>(true)
	const onToggleDeleteBoth = () => setIsDeleteBoth(!isDeleteBoth)
	const t = useTranslations("MODALS.DELETE_MESSAGES")

	const { onClose, currentModal } = useModal()
	const { data } = currentModal
	const chatId = data?.deleteMessages?.chatId
	const messageIds = data?.deleteMessages?.messageIds
	const interlocutorsName = data?.deleteMessages?.interlocutorsName
	const chatType = data?.deleteMessages?.chatType
	const clearSelectedMessages = data?.deleteMessages?.clearSelectedMessages

	const { mutateAsync: deleteMessage } = useDeleteMessage(chatId ?? "")

	const onDeleteMessages = async () => {
		if (!chatId || !messageIds) return
		try {
			await deleteMessage({ messageIds, chatId, delete_both: isDeleteBoth })
		} catch (error) {
			console.error(error)
		} finally {
			onClose()
			if (clearSelectedMessages) clearSelectedMessages()
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
				<Typography tag="p" className="text-[15px] ">
					{t("TITLE")}
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
							<div className="w-5 h-5 bg-white border  rounded peer-checked:bg-[#40A7E3] peer-checked:border-blue-500 peer-focus:ring-blue-200 transition-all duration-200 flex items-center justify-center">
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
				onSave={onDeleteMessages}
				isLoading={false}
				type="button"
				anotherName={t("DELETE_BUTTON")}
				className="after:h-0"
			/>
		</ModalLayout>
	)
}
