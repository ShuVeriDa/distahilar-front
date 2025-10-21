import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import { FC } from "react"

interface ITitleProps {
	name: string
	role: string
	isScreenSharing?: boolean | undefined
	className?: string
}

export const Title: FC<ITitleProps> = ({
	name,
	role,
	isScreenSharing,
	className,
}) => {
	const t = useTranslations("COMMON")

	const getRoleTranslation = (role: string) => {
		switch (role) {
			case "speaker":
				return t("SPEAKER")
			case "listener":
				return t("LISTENER")
			default:
				return role
		}
	}

	return (
		<div className="flex-1 min-w-0">
			<div className={cn("flex items-center gap-2 ", className)}>
				<Typography
					tag="p"
					className="text-white text-[14px] font-medium truncate"
				>
					{name}
				</Typography>
				{!isScreenSharing && (
					<span className="text-white/60 text-[12px] capitalize">
						{getRoleTranslation(role)}
					</span>
				)}
			</div>
		</div>
	)
}
