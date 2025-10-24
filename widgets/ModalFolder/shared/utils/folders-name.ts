import { useTranslations } from "next-intl"

export const getFolderName = (
	name: string,
	t: ReturnType<typeof useTranslations>
) => {
	return name === "All chats"
		? t("ALL_CHATS")
		: name === "Personal"
		? t("PERSONAL_FOLDER")
		: name === "Community"
		? t("COMMUNITY_FOLDER")
		: name
}
