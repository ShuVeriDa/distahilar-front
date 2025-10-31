import { UserType } from "@/prisma/models"
import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"
import { InfoItem } from "@/entities/AccountInfo"

interface IInfoProps {
	user: UserType
}

export const Info: FC<IInfoProps> = ({ user }) => {
	const { onOpenModal } = useModal()
	const t = useTranslations("MODALS.MY_ACCOUNT")

	const items = useMemo(
		() => [
			{
				id: 1,
				name: t("NAME"),
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
				name: t("PHONE_NUMBER"),
				icon: <IconRenderer iconName="Call" size={23} />,
				value: user?.phone,
				onOpen: () =>
					onOpenModal(EnumModel.CHANGE_PHONE, {
						changeInfo: {
							phone: user.phone,
						},
					}),
			},
			{
				id: 3,
				name: t("USERNAME"),
				icon: <IconRenderer iconName="At" size={23} />,
				value: `@${user?.username}`,
				onOpen: () =>
					onOpenModal(EnumModel.CHANGE_USERNAME, {
						changeInfo: {
							username: user.username,
						},
					}),
			},
		],
		[onOpenModal, user.name, user.phone, user.surname, user.username, t]
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
