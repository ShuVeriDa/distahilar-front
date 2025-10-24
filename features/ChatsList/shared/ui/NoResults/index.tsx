import { Typography } from "@/shared"
import { useTranslations } from "next-intl"
import { FC } from "react"

interface INoResultsProps {
	query: string
}

export const NoResults: FC<INoResultsProps> = ({ query }) => {
	const t = useTranslations("COMMON")
	return (
		<div className="w-full flex flex-col justify-center items-center p-2">
			<Typography tag="h6" className="text-[#677A8B] text-center">
				{t("NO_RESULTS")}
			</Typography>
			<Typography tag="p" className="text-[#677A8B] text-center">
				{t("NO_RESULTS_QUERY", { query })}
			</Typography>
		</div>
	)
}
