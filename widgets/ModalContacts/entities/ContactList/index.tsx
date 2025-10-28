import { ContactType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { ContactItem } from "../../shared/ui/ContactItem"

interface IContactListProps {
	contacts: ContactType[] | []
}

export const ContactList: FC<IContactListProps> = ({ contacts }) => {
	return (
		<div className={cn("flex flex-col gap-1 h-[480px] overflow-y-scroll py-3")}>
			{contacts.length === 0 ? (
				<div className="w-full h-full flex items-center justify-center">
					<Typography tag="h4">No contacts</Typography>
				</div>
			) : (
				contacts.map(contact => (
					<ContactItem key={contact.id} contact={contact} />
				))
			)}
		</div>
	)
}
