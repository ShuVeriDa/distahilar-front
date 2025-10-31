import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { FcFolder } from "react-icons/fc"

interface IBannerProps {}

export const FolderModalBanner: FC<IBannerProps> = () => {
	const t = useTranslations("MODALS.FOLDERS")

	return (
		<div className="w-full gap-3 h-[170px] bg-[#F1F1F1] dark:bg-[#232E3C] flex flex-col  justify-center items-center">
			<div>
				<FcFolder size={80} />
			</div>
			<div className="w-[270px]">
				<Typography tag="p" className="text-[14px] text-center text-[#858585]">
					{t("INFO")}
				</Typography>
			</div>
		</div>
	)
}

