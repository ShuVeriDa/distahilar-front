import { MediaTypeEnum } from "@/prisma/models"

export const getTypeOfMedia = (value: string) => {
	const type = value.split("/")[0]

	const mediasType =
		type === "audio"
			? MediaTypeEnum.AUDIO
			: type === "video"
			? MediaTypeEnum.VIDEO
			: type === "image"
			? MediaTypeEnum.IMAGE
			: MediaTypeEnum.FILE

	return mediasType
}
