"use client"

import { Login } from "@/features/Login"
import { Typography } from "@/shared/ui/Typography/Typography"
import { Register } from "@/widgets/Register"
import { NextPage } from "next"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"

interface IAuthProps {}

const Auth: NextPage<IAuthProps> = () => {
	const [type, setType] = useState<"login" | "register">("login")
	const t = useTranslations("COMMON")

	const onChangeType = () => {
		if (type === "login") setType("register")
		else setType("login")
	}

	const header = type === "login" ? t("SIGN_IN_TO_DISTAHILAR") : t("SIGN_UP")
	const titleForDescription =
		type === "login" ? t("DONT_HAVE_ACCOUNT") : t("ALREADY_HAVE_ACCOUNT")

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="min-w-[300px] flex flex-col gap-8">
				<div className="flex justify-center rounded-full">
					<Image src={"/images/icon.png"} alt="icon" width={160} height={160} />
				</div>

				<div className="flex flex-col gap-3.5 items-center">
					<Typography tag="h1" className="text-[32px] font-bold">
						{`${header}`}
					</Typography>
					<Typography tag="p" className="text-[16px] text-[#aaaaaa]">
						{t("FILL_ALL_FIELDS")}
					</Typography>
				</div>

				{type === "login" ? <Login /> : <Register />}

				<div className="">
					<Typography tag="div" className="text-gray-400 text-[14px]">
						{titleForDescription}&nbsp;
						<span
							onClick={onChangeType}
							className="dark:text-white text-gray-600 font-bold hover:cursor-pointer"
						>
							{type === "login" ? t("SIGN_UP") : t("SIGN_IN")}
						</span>
					</Typography>
				</div>
			</div>
		</div>
	)
}
export default Auth
