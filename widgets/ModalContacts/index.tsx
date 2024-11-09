"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { useSearchContact } from "@/shared/hooks/useSearchContact"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import { Search } from "../Search"
import { ContactList } from "./entities/ContactList"

interface IModalContactsProps {}

export const ModalContacts: FC<IModalContactsProps> = () => {
	const { onClose, modalData } = useModal()
	const { isOpen, type } = modalData
	const isModalOpen = isOpen && type === EnumModel.CONTACTS
	const { contacts, onChangeValue, value, isSuccess } =
		useSearchContact(isModalOpen)

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout isModalOpen={isModalOpen} onClose={onClose} className="p-0 ">
			<div className={cn("flex flex-col gap-4 px-4 pt-4", CLASSNAME_UNDERLINE)}>
				<Typography tag="h4" className="font-normal">
					Contacts
				</Typography>

				<Search
					variant="searchV1"
					value={value}
					onChange={onChangeValue}
					placeholder="Search"
					className="placeholder:text-[#6D7883]"
				/>
			</div>

			<ContactList contacts={isSuccess && contacts ? contacts : []} />

			<div
				className={cn(
					"flex items-center justify-end px-3 py-2 after:top-0",
					CLASSNAME_UNDERLINE
				)}
			>
				<Button
					title="Close"
					variant="withoutBg"
					size="default"
					onClick={onClose}
				/>
			</div>
		</ModalLayout>
	)
}
