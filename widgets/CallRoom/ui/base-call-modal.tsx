"use client"

import { ChatMemberType, ChatRole, ChatType, UserType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import Image from "next/image"
import { FC, ReactNode } from "react"
import { MdClose } from "react-icons/md"

export interface CallModalButton {
	id: string
	onClick: () => void
	icon: ReactNode
	label: string
	className?: string
	iconClassName?: string
}

interface BaseCallModalProps {
	isOpen: boolean
	onClose?: () => void
	chat: ChatType | undefined
	user: UserType | null
	description: string
	buttons: CallModalButton[]
	isConnecting?: boolean
	connectingContent?: ReactNode
	showCloseButton?: boolean
	shouldRender?: boolean
	className?: string
}

export const BaseCallModal: FC<BaseCallModalProps> = ({
	isOpen,
	onClose,
	chat,
	user,
	description,
	buttons,
	isConnecting = false,
	connectingContent,
	showCloseButton = true,
	shouldRender = true,
	className,
}) => {
	const member = chat?.members.find(
		(member: ChatMemberType) => member.userId !== user?.id
	)
	const name = `${member?.user.name} ${member?.user.surname}`
	const title = chat?.type === ChatRole.DIALOG ? name : chat?.name

	const image =
		chat?.type === ChatRole.DIALOG
			? member?.user.imageUrl || ""
			: chat?.imageUrl

	if (!shouldRender) return null

	return (
		<div className={cn(isOpen ? "flex" : "hidden")}>
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-white">
				<div
					className={cn(
						"flex flex-col justify-end items-center gap-20 bg-[#1B1F23] rounded-lg pt-6 px-6 pb-1.5 max-w-[720px] min-h-[540px] w-full relative",
						className
					)}
				>
					<div className="flex flex-col items-center justify-center gap-10">
						{showCloseButton && onClose && (
							<div className="flex items-center justify-between">
								<Button
									variant="clean"
									onClick={onClose}
									className="p-1 absolute right-1 top-1"
								>
									<MdClose
										size={20}
										className="text-white hover:text-gray-500"
									/>
								</Button>
							</div>
						)}

						<div className="flex flex-col items-center justify-center gap-10">
							<div className="flex flex-col items-center gap-2 w-full h-full max-w-[160px] max-h-[160px]">
								<Image
									src={image || "/images/no-avatar.png"}
									alt="call"
									className="w-full h-full object-cover rounded-full"
									width={160}
									height={160}
								/>
							</div>

							<div className="flex flex-col items-center gap-2">
								<Typography
									tag="p"
									className="text-center text-[20px] font-semibold"
								>
									{title}
								</Typography>
								<Typography
									tag="p"
									className="text-center text-[#AAABAC] w-[270px] leading-5"
								>
									{description}
								</Typography>
							</div>
						</div>
					</div>

					{isConnecting && connectingContent ? (
						connectingContent
					) : (
						<div className="flex gap-4 justify-center">
							{buttons.map(button => (
								<Button
									key={button.id}
									onClick={button.onClick}
									className="flex flex-col items-center gap-2 text-white text-[14px]"
									variant="clean"
								>
									<div
										className={cn(
											"flex items-center gap-2 p-2 rounded-full",
											button.iconClassName
										)}
									>
										{button.icon}
									</div>
									<span>{button.label}</span>
								</Button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
