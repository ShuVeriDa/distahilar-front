"use client"

import { Button } from "@/shared"
import { useAuthQuery } from "@/shared/lib/services/auth/useAuthQuery"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"

import { FC } from "react"
import { TbLogout } from "react-icons/tb"

interface ILogoutProps {}

export const Logout: FC<ILogoutProps> = () => {
	const t = useTranslations("COMMON")
	const { logout } = useAuthQuery()
	const { mutate } = logout

	const onLogout = () => mutate()

	return (
		<div className="w-full mb-0.5">
			<Button
				onClick={onLogout}
				title="Logout"
				className={cn(
					"h-fit p-0 group min-w-[70px] w-full min-h-[64px] py-[11px] flex-col gap-1 hover:bg-white/10 flex items-center justify-center cursor-pointer"
				)}
			>
				<TbLogout size={30} className="text-red-500 " />
				<span className="text-[12px] text-red-500 text-center ">
					{t("LOGOUT")}
				</span>
			</Button>
		</div>
	)
}
