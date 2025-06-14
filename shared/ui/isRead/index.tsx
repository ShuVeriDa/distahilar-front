import { MessageStatus } from "@/prisma/models"
import { useTheme } from "next-themes"
import { FC } from "react"
import { LuCheck, LuCheckCheck, LuClock3 } from "react-icons/lu"

export enum IsReadType {
	MESSAGE_MENU = "MESSAGE_MENU",
}

interface IIsReadProps {
	status: MessageStatus
	isCircleVideo?: boolean
	isReadType?: IsReadType
}

export const IsRead: FC<IIsReadProps> = ({
	status,
	isCircleVideo,
	isReadType,
}) => {
	const { theme } = useTheme()
	const iconsColor =
		isReadType === IsReadType.MESSAGE_MENU
			? theme === "light"
				? "#000000"
				: "#ffffff"
			: theme === "light" && !isCircleVideo
			? "#57B84C"
			: isCircleVideo
			? "#ffffff"
			: "#71BBFC"
	return (
		<>
			{status === MessageStatus.PENDING && <LuClock3 color={iconsColor} />}
			{status === MessageStatus.READ && <LuCheckCheck color={iconsColor} />}
			{status === MessageStatus.SENT && <LuCheck color={iconsColor} />}
		</>
	)
}
