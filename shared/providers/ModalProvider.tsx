"use client"

import { ModalAccountInfo } from "@/widgets/ModalAccountInfo"
import { ModalAddFile } from "@/widgets/ModalAddFile/ui"
import { ModalChangeName } from "@/widgets/ModalChangeName"
import { ModalChangePhone } from "@/widgets/ModalChangePhone"
import { ModalChangeUserName } from "@/widgets/ModalChangeUsername"
import { ModalContacts } from "@/widgets/ModalContacts"
import { ModalCreateChannelGroup } from "@/widgets/ModalCreateChannelGroup"
import { ModalCreateFolder } from "@/widgets/ModalCreateFolder"
import { ModalDeleteChat } from "@/widgets/ModalDeleteChat"
import { ModalDeleteMessages } from "@/widgets/ModalDeleteMessages"
import { ModalEditFolder } from "@/widgets/ModalEditFolder"
import { ModalFolder } from "@/widgets/ModalFolder"
import { ModalFolderIncludeChats } from "@/widgets/ModalFolderIncludeChats/ui/ModalFolderIncludeChats"
import { ModalMembers } from "@/widgets/ModalMembers"
import { ModalSettings } from "@/widgets/ModalSettings"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { useModal } from "../hooks/useModal"
import { EnumModel } from "../lib/redux-store/slices/model-slice/type"

interface IModalProviderProps {}

export const ModalProvider: FC<IModalProviderProps> = () => {
	const [isMounted, setIsMounted] = useState(false)
	const { onClose, currentModal, isModalOpen } = useModal()
	const pathname = usePathname()

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (pathname === "/auth") onClose()
	}, [pathname, onClose])

	if (!isMounted) {
		return null
	}

	return (
		<AnimatePresence mode="wait">
			{isModalOpen &&
				(currentModal.type === EnumModel.CHANNEL ||
					currentModal.type === EnumModel.GROUP) && (
					<ModalCreateChannelGroup key={"modal-create-channel-group"} />
				)}
			{isModalOpen && currentModal.type === EnumModel.CONTACTS && (
				<ModalContacts key={"modal-contacts"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.SETTINGS && (
				<ModalSettings key={"modal-settings"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.ACCOUNT && (
				<ModalAccountInfo key={"modal-settings-info"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.CHANGE_NAME && (
				<ModalChangeName key={"modal-change-name"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.CHANGE_PHONE && (
				<ModalChangePhone key={"modal-change-phone"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.CHANGE_USERNAME && (
				<ModalChangeUserName key={"modal-change-username"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.FOLDERS && (
				<ModalFolder key={"modal-folder"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.CREATE_FOLDER && (
				<ModalCreateFolder key={"create-folder"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.EDIT_FOLDER && (
				<ModalEditFolder key="edit-folder" />
			)}
			{isModalOpen && currentModal.type === EnumModel.INCLUDE_CHATS && (
				<ModalFolderIncludeChats key={"modal-folder-include-chats"} />
			)}

			{isModalOpen && currentModal.type === EnumModel.DELETE_MESSAGES && (
				<ModalDeleteMessages key={"modal-delete-messages"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.DELETE_CHAT && (
				<ModalDeleteChat key={"modal-delete-chat"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.ADD_FILES && (
				<ModalAddFile key={"modal-chat-add-file"} />
			)}
			{isModalOpen && currentModal.type === EnumModel.MEMBERS && (
				<ModalMembers key={"modal-members"} />
			)}
		</AnimatePresence>
	)
}
