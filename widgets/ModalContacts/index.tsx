"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { useSearchContact } from "@/shared/hooks/useSearchContact"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button/button"
import { Typography } from "@/shared/ui/Typography/Typography"
import Image from "next/image"
import { Search } from "../Search"

interface IModalContactsProps {}

export const ModalContacts: FC<IModalContactsProps> = () => {
	const { onClose, modalData } = useModal()
	const { isOpen, type } = modalData
	const isModalOpen = isOpen && type === EnumModel.CONTACTS
	const { contacts, onChangeValue, value } = useSearchContact(isModalOpen)

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout isModalOpen={isModalOpen} onClose={onClose} className="p-0 ">
			<div className={cn("flex flex-col gap-4 px-4 pt-4", CLASSNAME_UNDERLINE)}>
				<Typography tag="h4" className="!font-normal">
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
			<div className={cn("flex flex-col gap-1 h-[480px] overflow-y-scroll")}>
				{contacts &&
					contacts.map(contact => {
						const fullName = `${contact.savedContact.name} ${contact.savedContact.surname}`
						return (
							<button
								key={contact.id}
								className="min-h-[52px] flex gap-2 items-center hover:bg-[#3b556f] px-4"
							>
								<div className="rounded-full w-[40px] h-[40px]">
									<Image
										src={contact.savedContact.imageUrl!}
										alt={`avatar-${contact.savedContact.name}`}
										className="rounded-full"
										width={40}
										height={40}
									/>
								</div>
								<div className="flex flex-col items-start">
									<Typography tag="p" className="text-[15px]">
										{fullName}
									</Typography>
									<Typography tag="p" className="text-[12px] text-[#559BE0]">
										online
									</Typography>
								</div>
							</button>
						)
					})}
			</div>
			<div
				className={cn(
					"flex items-center justify-end px-3 py-2 after:top-0",
					CLASSNAME_UNDERLINE
				)}
			>
				<Button
					className="bg-transition h-[36px] text-[#168ACD] dark:text-[#5DB2F2] hover:bg-[rgba(106,139,172,0.2)] hover:dark:bg-[rgba(23,63,103,0.2)]"
					type="button"
					onClick={onClose}
				>
					Close
				</Button>
			</div>
		</ModalLayout>
	)
}
