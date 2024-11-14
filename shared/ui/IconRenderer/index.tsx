import AllChats from "@/public/images/icons/all-chats.svg"
import Folder from "@/public/images/icons/folder.svg"
import Megaphone from "@/public/images/icons/megaphone.svg"
import User from "@/public/images/icons/user.svg"
import { FC } from "react"

interface IIconRendererProps {
	iconName: string
	className?: string
}

const icons = [
	{
		name: "Folder",
		icon: Folder,
	},
	{
		name: "AllChats",
		icon: AllChats,
	},
	{
		name: "Megaphone",
		icon: Megaphone,
	},
	{
		name: "User",
		icon: User,
	},
]

export const IconRenderer: FC<IIconRendererProps> = ({
	iconName,
	className,
}) => {
	const IconComponent = icons.find(icon => icon.name === iconName)?.icon

	return IconComponent ? <IconComponent className={className} /> : null
}
