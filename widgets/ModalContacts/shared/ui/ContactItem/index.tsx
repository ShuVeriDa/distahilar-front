import { ContactType } from "@/prisma/models"
import { useDeleteContactQuery } from "@/shared/lib/services/contact/useContactQuery"
import { cn } from "@/shared/lib/utils/cn"
import { useFormatLastSeen } from "@/shared/lib/utils/formatLastSeen"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { FC, MouseEvent, useState } from "react"
import { GoTrash } from "react-icons/go"

interface IContactItemProps {
	contact: ContactType
}

export const ContactItem: FC<IContactItemProps> = ({ contact }) => {
	const router = useRouter()
	const params = useParams()
	const locale = params.locale as string
	const t = useTranslations("COMMON")
	const lastSeen = useFormatLastSeen(contact.savedContact.lastSeen)

	const fallback = "/images/no-avatar.png"
	const [imgSrc, setImgSrc] = useState<string>(
		contact.savedContact.imageUrl && contact.savedContact.imageUrl.trim()
			? contact.savedContact.imageUrl
			: fallback
	)

	const fullName = `${contact.savedContact.name} ${contact.savedContact.surname}`

	const { mutateAsync: deleteContact } = useDeleteContactQuery(
		contact.savedContact.id
	)

	const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		await deleteContact()
	}

	const handleNavigateToChat = () => {
		router.push(`/${locale}/chat/${contact.savedContact.id}`)
	}

	const onlineText = contact.savedContact.isOnline
		? t("ONLINE")
		: contact.savedContact.lastSeen
		? lastSeen
		: ""

	return (
		<div className="min-h-[52px] flex gap-2 items-center hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[#292d35] px-4 relative group">
			<button
				onClick={handleNavigateToChat}
				className="flex gap-2 items-center w-full"
			>
				<div className="rounded-full w-[40px] h-[40px]">
					<Image
						src={imgSrc}
						alt={`avatar-${contact.savedContact.name}`}
						className="rounded-full"
						width={40}
						height={40}
						unoptimized
						onError={() => {
							if (imgSrc !== fallback) setImgSrc(fallback)
						}}
					/>
				</div>
				<div className="flex flex-col items-start">
					<Typography tag="p" className="text-[15px]">
						{fullName}
					</Typography>
					<Typography
						tag="p"
						className={cn(
							"text-[12px]",
							contact.savedContact.isOnline
								? "text-[#559BE0]"
								: "text-[#6D7883]"
						)}
					>
						{onlineText}
					</Typography>
				</div>
			</button>
			<button
				onClick={handleDelete}
				className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[#202B38] rounded"
			>
				<GoTrash size={18} className="text-[#EC3942]" />
			</button>
		</div>
	)
}
