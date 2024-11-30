"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { useSearchContact } from "@/shared/hooks/useSearchContact"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import { Search } from "../Search"
import { ContactList } from "./entities/ContactList"

interface IModalContactsProps {}

export const ModalContacts: FC<IModalContactsProps> = () => {
	const { onClose, isModalOpen } = useModal()

	const { contacts, onChangeValue, value, isSuccess } =
		useSearchContact(isModalOpen)

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout onClose={onClose} className="p-0 " isClickOutside>
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
				<Button variant="withoutBg" size="md" onClick={onClose}>
					Close
				</Button>
			</div>
		</ModalLayout>
	)
}
