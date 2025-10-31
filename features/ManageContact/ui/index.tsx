import { ChatRole } from "@/prisma/models"
import { Button, Typography, useModal, useUser } from "@/shared"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import {
	useCreateContactQuery,
	useDeleteContactQuery,
} from "@/shared/lib/services/contact/useContactQuery"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import { FC, useCallback, useMemo } from "react"
import { GoTrash } from "react-icons/go"
import { MdOutlinePersonAddAlt } from "react-icons/md"
import { TbLogout } from "react-icons/tb"

interface IManageContactProps {
	interlocutorId: string | undefined
	interlocutorsName: string | undefined
	chatName?: string | undefined
	chatId: string | undefined
	chatType: ChatRole | undefined
	interlocutorsAvatar: string | null | undefined
	isOwner?: boolean
}

export const ManageContact: FC<IManageContactProps> = ({
	interlocutorId,
	interlocutorsName,
	chatName,
	chatId,
	chatType,
	interlocutorsAvatar,
	isOwner,
}) => {
	const { user } = useUser()
	const t = useTranslations("COMMON")

	const isContactExist = user?.contactSaver.some(
		contact => contact.savedContactId === interlocutorId
	)

	const title = isContactExist ? t("DELETE_CONTACT") : t("ADD_TO_CONTACTS")

	const { mutateAsync: addContact } = useCreateContactQuery()
	const { mutateAsync: removeContact } = useDeleteContactQuery(interlocutorId!)

	const { onOpenModal } = useModal()

	const handleManageContact = useCallback(async () => {
		if (isContactExist) {
			await removeContact()
		} else {
			await addContact(interlocutorId!)
		}
	}, [addContact, interlocutorId, isContactExist, removeContact])

	const buttons = useMemo(() => {
		const destructiveTitle =
			chatType === ChatRole.DIALOG
				? t("DELETE_CHAT")
				: chatType === ChatRole.CHANNEL
				? isOwner
					? t("DELETE_CHANNEL")
					: t("LEAVE_CHANNEL")
				: isOwner
				? t("DELETE_GROUP")
				: t("LEAVE_GROUP")

		const result = [] as {
			title: string
			icon: JSX.Element
			function: () => void
		}[]

		if (chatType === ChatRole.DIALOG) {
			result.push({
				title: title,
				icon: isContactExist ? (
					<GoTrash size={23} className="text-[#444444] dark:text-white" />
				) : (
					<MdOutlinePersonAddAlt
						size={23}
						className="text-[#444444] dark:text-white"
					/>
				),
				function: () => handleManageContact(),
			})
		}

		result.push({
			title: destructiveTitle,
			icon:
				chatType === ChatRole.DIALOG || isOwner ? (
					<GoTrash size={23} className="text-[#EC3942]" />
				) : (
					<TbLogout size={23} className="text-[#EC3942]" />
				),
			function: () => {
				onOpenModal(EnumModel.DELETE_CHAT, {
					deleteChat: {
						chatId: chatId,
						interlocutorsAvatar: interlocutorsAvatar,
						interlocutorsName:
							chatType === ChatRole.DIALOG ? interlocutorsName : undefined,
						chatName: chatType !== ChatRole.DIALOG ? chatName : undefined,
						chatType: chatType as ChatRole,
						isOwner: !!isOwner,
					},
				})
			},
		})

		return result
	}, [
		chatId,
		chatName,
		chatType,
		handleManageContact,
		interlocutorsAvatar,
		interlocutorsName,
		isContactExist,
		onOpenModal,
		title,
		t,
		isOwner,
	])

	return (
		<div className="w-full flex flex-col gap-2 py-3">
			{buttons.map((button, index) => (
				<Button
					key={index}
					variant="clean"
					className="w-full flex !justify-start gap-8 p-0 hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C] px-5 py-2"
					onClick={button.function}
				>
					<div>{button.icon}</div>
					<div className="flex flex-col gap-2">
						<Typography
							tag="p"
							className={cn(
								"text-[13px]",
								index === buttons.length - 1
									? "text-[#EC3942]"
									: "text-[#444444] dark:text-white"
							)}
						>
							{button.title}
						</Typography>
					</div>
				</Button>
			))}
		</div>
	)
}
