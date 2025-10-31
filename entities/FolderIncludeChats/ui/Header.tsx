import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { FC } from "react"

interface IFolderIncludeChatsHeaderProps {
	chatsLength: string
}

export const FolderIncludeChatsHeader: FC<IFolderIncludeChatsHeaderProps> = ({
	chatsLength,
}) => {
	const t = useTranslations("MODALS.FOLDERS.MANAGE_FOLDER")

	return (
		<div className="flex items-center gap-3 px-4 py-4">
			<Typography tag="h4" className="font-normal">
				{t("INCLUDE_CHATS")}
			</Typography>
			<Typography tag="span" className="font-normal text-[#787F86] text-[13px]">
				{chatsLength}
			</Typography>
		</div>
	)
}

