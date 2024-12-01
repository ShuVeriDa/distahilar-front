import { UserType } from "@/prisma/models"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { FC, useMemo } from "react"
import { InfoItem } from "../../entities/InfoItem"

interface IInfoProps {
	user: UserType
}

export const Info: FC<IInfoProps> = ({ user }) => {
	console.log({ user })

	const items = useMemo(
		() => [
			{
				id: 1,
				name: "Name",
				icon: <IconRenderer iconName="User2" size={23} />,
				value: user?.name,
			},
			{
				id: 2,
				name: "Phone number",
				icon: <IconRenderer iconName="Call" size={23} />,
				value: user?.phone,
			},
			{
				id: 3,
				name: "Username",
				icon: <IconRenderer iconName="At" size={23} />,
				value: `@${user?.username}`,
			},
		],
		[user]
	)
	return (
		<div className="py-1.5 w-full">
			{items.map(obj => {
				return (
					<InfoItem
						key={obj.id}
						id={obj.id}
						icon={obj.icon}
						name={obj.name}
						value={obj.value}
					/>
				)
			})}
		</div>
	)
}
