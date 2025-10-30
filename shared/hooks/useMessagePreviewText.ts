import { FoundedChatsType, MediaTypeEnum, MessageEnum } from "@/prisma/models"
import { useTranslations } from "next-intl"

// Хук для определения типа сообщения для отображения
export const useMessagePreviewText = (
	message: FoundedChatsType["lastMessage"]
): string => {
	const t = useTranslations("CHAT.MESSAGE_TYPES")

	if (!message) return ""

	switch (message.messageType) {
		case MessageEnum.VIDEO:
			return t("VIDEO")
		case MessageEnum.VOICE:
			return t("VOICE")
		case MessageEnum.FILE:
			// Если это FILE, проверяем media
			if (message.media && message.media.length > 0) {
				const mediaType = message.media[0]?.type as MediaTypeEnum
				switch (mediaType) {
					case MediaTypeEnum.IMAGE:
						return t("PHOTO")
					case MediaTypeEnum.VIDEO:
						return t("VIDEO")
					case MediaTypeEnum.AUDIO:
						return t("AUDIO")
					case MediaTypeEnum.FILE:
						return t("FILE")
					default:
						return message.content || ""
				}
			}
			return t("FILE")
		case MessageEnum.TEXT:
			return message.content || ""
		default:
			return message.content || ""
	}
}
