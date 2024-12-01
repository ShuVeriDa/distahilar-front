"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { useUser } from "@/shared/hooks/useUser"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { NameAndOnline } from "./entities/NameAndOnline"
import { Avatar } from "./features/Avatar"
import { Bio } from "./features/Bio"
import { Info } from "./features/Info"
import { Description } from "./shared/ui/Description"

interface IModalAccountInfoProps {}

export const ModalAccountInfo: FC<IModalAccountInfoProps> = () => {
	const { onClose, popoverRef, onCloseCurrentModal } = useModal()
	const { user } = useUser()

	return (
		<ModalLayout
			onClose={onClose}
			className="p-0"
			isXClose
			popoverRef={popoverRef}
			isClickOutside
			onClickLeftArrow={onCloseCurrentModal}
		>
			<div className={cn("flex flex-col gap-4 ml-12 px-4 py-4")}>
				<Typography tag="h4" className="font-normal">
					Info
				</Typography>
			</div>
			<div className="w-full flex flex-col gap-5 items-center justify-center pb-1.5">
				<div className="flex flex-col gap-2 items-center justify-center">
					<Avatar avatar={user?.imageUrl ? user.imageUrl : ""} />

					<NameAndOnline name={user?.name ? user.name : ""} />
				</div>

				<Bio />
			</div>
			<Description
				text={cn(
					`Any details such as age, occupation or city. Example: 23 y.o. designer from San Francisco`
				)}
				splitWord="Example:"
			/>

			<Info user={user!} />

			<Description
				text={cn(
					`Username lets people contact you on DistaHilar without needing your phone number.`
				)}
			/>
		</ModalLayout>
	)
}
