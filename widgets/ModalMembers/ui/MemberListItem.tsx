"use client"

import { ChatMemberType, MemberRole } from "@/prisma/models"
import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/Dropdown-menu/dropdown-menu"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"
import { MemberAvatar } from "./MemberAvatar"

type Props = {
	member: ChatMemberType
	isGroup: boolean
	canPromote: boolean
	canRemove: boolean
	onChangeRole: (memberId: string, role: MemberRole) => void
	onRemove: (memberId: string) => void
}

export const MemberListItem: FC<Props> = ({
	member,
	isGroup,
	canPromote,
	canRemove,
	onChangeRole,
	onRemove,
}) => {
	const t = useTranslations("MEMBERS")

	const role = member.role as MemberRole
	const showPromoteAdmin =
		canPromote && role !== MemberRole.ADMIN && role !== MemberRole.OWNER
	const showDemoteAdmin = canPromote && role === MemberRole.ADMIN
	const showPromoteModerator = canPromote && role === MemberRole.GUEST
	const showDemoteModerator = canPromote && role === MemberRole.MODERATOR
	const showRemove = canRemove && role !== MemberRole.OWNER

	const memberName = useMemo(() => {
		const composed = `${member.user?.name ?? ""} ${
			member.user?.surname ?? ""
		}`.trim()
		return composed || member.user?.username || "member"
	}, [member.user?.name, member.user?.surname, member.user?.username])

	return (
		<div className="flex items-center justify-between py-2 px-3 hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[#292d35] hover:cursor-pointer">
			<div className="flex items-center gap-2">
				<div className="h-8 w-8 rounded-full bg-[#E7E7E7] overflow-hidden">
					<MemberAvatar
						src={member.user?.imageUrl ?? undefined}
						alt={memberName}
					/>
				</div>
				<div className="flex flex-col">
					<Typography
						tag="p"
						className="text-[14px] text-[#444444] dark:text-white"
					>
						{memberName}
					</Typography>
					<Typography
						tag="p"
						className="text-[12px] text-[#707579] dark:text-[#708499]"
					>
						{role}
					</Typography>
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(
						"text-[#999999] text-sm px-2 py-1 rounded ",
						role === MemberRole.OWNER && "hidden"
					)}
				>
					•••
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{showPromoteAdmin && (
						<DropdownMenuItem
							onClick={() => onChangeRole(member.id, MemberRole.ADMIN)}
						>
							{t("MAKE_ADMIN")}
						</DropdownMenuItem>
					)}
					{showDemoteAdmin && (
						<DropdownMenuItem
							onClick={() => onChangeRole(member.id, MemberRole.GUEST)}
						>
							{t("REMOVE_ADMIN")}
						</DropdownMenuItem>
					)}
					{showPromoteModerator && (
						<DropdownMenuItem
							onClick={() => onChangeRole(member.id, MemberRole.MODERATOR)}
						>
							{t("MAKE_MODERATOR")}
						</DropdownMenuItem>
					)}
					{showDemoteModerator && (
						<DropdownMenuItem
							onClick={() => onChangeRole(member.id, MemberRole.GUEST)}
						>
							{t("REMOVE_MODERATOR")}
						</DropdownMenuItem>
					)}
					{showRemove && (
						<DropdownMenuItem
							className="text-[#EC3942]"
							onClick={() => onRemove(member.id)}
						>
							{isGroup ? t("REMOVE_FROM_GROUP") : t("REMOVE_FROM_CHANNEL")}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
