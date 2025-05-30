"use client"

import { FC, useState } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ChatRole } from "@/prisma/models"
import { Typography, useModal } from "@/shared"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { useDeleteChatQuery } from "@/shared/lib/services/chat/useChatQuery"
import Image from "next/image"
import { FaCheck } from "react-icons/fa6"

interface IModalDeleteChatProps {}

export const ModalDeleteChat: FC<IModalDeleteChatProps> = () => {
	const [isDeleteBoth, setIsDeleteBoth] = useState<boolean>(false)
	const onToggleDeleteBoth = () => setIsDeleteBoth(!isDeleteBoth)

	const { onClose, currentModal } = useModal()
	const { data } = currentModal
	const chatId = data?.deleteChat?.chatId
	const chatType = data?.deleteChat?.chatType
	const interlocutorsAvatar = data?.deleteChat?.interlocutorsAvatar
	const interlocutorsName = data?.deleteChat?.interlocutorsName

	const { mutateAsync: deleteChat } = useDeleteChatQuery(chatId!)

	const onDeleteChat = async () => {
		if (!chatId) return
		try {
			await deleteChat({ delete_both: isDeleteBoth })
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
							Delete chat
						</Typography>
					</div>
				</div>
				<Typography tag="p" className="text-[15px] ">
					Are you sure you want to delete all message history with{" "}
					{interlocutorsName}? <br />
					<br />
					This action cannot be undone.
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
								Also delete for {interlocutorsName}
							</Typography>
						</label>
					</div>
				)}
			</div>

			<ModalFooter
				onClose={onClose}
				onSave={onDeleteChat}
				isLoading={false}
				type="button"
				anotherName="Delete"
				className="after:h-0"
			/>
		</ModalLayout>
	)
}
