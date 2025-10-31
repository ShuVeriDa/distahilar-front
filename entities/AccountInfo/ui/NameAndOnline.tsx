import { cn } from "@/shared/lib/utils/cn"
import { useFormatLastSeen } from "@/shared/lib/utils/formatLastSeen"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { FC } from "react"

interface INameAndOnlineProps {
	name: string
	isOnline?: boolean | null
	lastSeen?: Date | null
}

export const NameAndOnline: FC<INameAndOnlineProps> = ({
	name,
	isOnline,
	lastSeen,
}) => {
	const t = useTranslations("COMMON")
	const lastSeenFormatted = useFormatLastSeen(lastSeen)

	const statusText = isOnline ? t("ONLINE") : lastSeenFormatted || ""

	return (
		<div className="flex flex-col items-center justify-center">
			<Typography tag="p" className="text-[18px]">
				{name}
			</Typography>

			{statusText && (
				<Typography
					tag="span"
					className={cn(
						"text-[13px] font-normal text-[#708499]",
						isOnline && "text-[#5EB5F7]"
					)}
				>
					{statusText}
				</Typography>
			)}
		</div>
	)
}

