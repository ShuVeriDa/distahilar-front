import { ContactType } from "@/prisma/models"
import { Typography } from "@/shared/ui/Typography/Typography"
import Image from "next/image"
import { FC } from "react"

interface IContactItemProps {
	contact: ContactType
}

export const ContactItem: FC<IContactItemProps> = ({ contact }) => {
	const fullName = `${contact.savedContact.name} ${contact.savedContact.surname}`
	return (
		<button
			key={contact.id}
			className="min-h-[52px] flex gap-2 items-center hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[#292d35] px-4"
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
}
