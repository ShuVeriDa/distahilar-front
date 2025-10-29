"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { useUser } from "@/shared/hooks/useUser"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { NameAndOnline } from "./entities/NameAndOnline"
import { Avatar } from "./features/Avatar"
import { Bio } from "./features/Bio"
import { Info } from "./features/Info"
import { Description } from "./shared/ui/Description"

interface IModalAccountInfoProps {}

export const ModalAccountInfo: FC<IModalAccountInfoProps> = () => {
	const { onClose, popoverRef, onCloseCurrentModal } = useModal()
	const { user } = useUser()
	const tAccountInfo = useTranslations("MODALS.ACCOUNT_INFO")
	const tMyAccount = useTranslations("MODALS.MY_ACCOUNT")

	console.log({ user })

	return (
		<ModalLayout
			onClose={onClose}
			className="p-0 pb-5"
			isXClose
			popoverRef={popoverRef}
			isClickOutside={false}
			onClickLeftArrow={onCloseCurrentModal}
		>
			<div className={cn("flex flex-col gap-4 ml-12 px-4 py-4")}>
				<Typography tag="h4" className="font-normal">
					{tAccountInfo("TITLE")}
				</Typography>
			</div>
			<div className="w-full flex flex-col gap-5 items-center justify-center pb-1.5">
				<div className="flex flex-col gap-2 items-center justify-center">
					<Avatar
						avatar={user?.imageUrl ? user.imageUrl : "/images/no-avatar.png"}
					/>

					<NameAndOnline
						name={user?.name ? user.name : ""}
						isOnline={user?.isOnline}
						lastSeen={user?.lastSeen}
					/>
				</div>

				<Bio />
			</div>
			<Description
				text={cn(
					`${tMyAccount("BIO_INFO.TITLE")} Example: ${tMyAccount(
						"BIO_INFO.EXAMPLE"
					)}`
				)}
				splitWord="Example:"
			/>

			<Info user={user!} />

			<Description text={cn(tMyAccount("USERNAME_INFO"))} />
		</ModalLayout>
	)
}
