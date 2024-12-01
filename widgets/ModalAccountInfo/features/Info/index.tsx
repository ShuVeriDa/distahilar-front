import { UserType } from "@/prisma/models"
import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { FC, useMemo } from "react"
import { InfoItem } from "../../entities/InfoItem"

interface IInfoProps {
	user: UserType
}

export const Info: FC<IInfoProps> = ({ user }) => {
	const { onOpenModal } = useModal()

	const items = useMemo(
		() => [
			{
				id: 1,
				name: "Name",
				icon: <IconRenderer iconName="User2" size={23} />,
				value: user?.name,
				onOpen: () =>
					onOpenModal(EnumModel.CHANGE_NAME, {
						changeInfo: {
							firstName: user.name,
							surname: user.surname,
						},
					}),
			},
			{
				id: 2,
				name: "Phone number",
				icon: <IconRenderer iconName="Call" size={23} />,
				value: user?.phone,
				onOpen: () =>
					onOpenModal(EnumModel.CHANGE_NAME, {
						changeInfo: {
							phone: user.phone,
						},
					}),
			},
			{
				id: 3,
				name: "Username",
				icon: <IconRenderer iconName="At" size={23} />,
				value: `@${user?.username}`,
				onOpen: () =>
					onOpenModal(EnumModel.CHANGE_NAME, {
						changeInfo: {
							username: user.username,
						},
					}),
			},
		],
		[onOpenModal, user.name, user.phone, user.surname, user.username]
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
						onOpen={obj.onOpen}
					/>
				)
			})}
		</div>
	)
}
