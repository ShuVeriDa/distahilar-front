import { Button, Typography, useUser } from "@/shared"
import {
	useCreateContactQuery,
	useDeleteContactQuery,
} from "@/shared/lib/services/contact/useContactQuery"
import { FC } from "react"
import { GoTrash } from "react-icons/go"
import { MdOutlinePersonAddAlt } from "react-icons/md"

interface IManageContactProps {
	interlocutorId: string | undefined
}

export const ManageContact: FC<IManageContactProps> = ({ interlocutorId }) => {
	const { user } = useUser()
	console.log({ contactSaver: user?.contactSaver })
	console.log({ user })

	const isContactExist = user?.contactSaver.some(
		contact => contact.savedContactId === interlocutorId
	)

	const title = isContactExist ? "Delete Contact" : "Add to contacts"

	const { mutateAsync: addContact } = useCreateContactQuery()
	const { mutateAsync: removeContact } = useDeleteContactQuery(interlocutorId!)

	const handleManageContact = async () => {
		if (isContactExist) {
			await removeContact()
		} else {
			await addContact(interlocutorId!)
		}
	}

	return (
		<div className="w-full flex flex-col gap-2 py-3">
			<Button
				variant="clean"
				className="w-full flex !justify-start gap-8 p-0 hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C] px-5 py-2"
				onClick={handleManageContact}
			>
				<div>
					{isContactExist ? (
						<GoTrash size={23} className="text-[#444444] dark:text-white" />
					) : (
						<MdOutlinePersonAddAlt
							size={23}
							className="text-[#444444] dark:text-white"
						/>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<Typography
						tag="p"
						className="text-[13px] text-[#444444] dark:text-white"
					>
						{title}
					</Typography>
				</div>
			</Button>
		</div>
	)
}
