import { MessageStatus } from "@/prisma/models"
import { useTheme } from "next-themes"
import { FC } from "react"
import { LuCheck, LuCheckCheck, LuClock3 } from "react-icons/lu"

interface IIsReadProps {
	status: MessageStatus
	isCircleVideo?: boolean
}

export const IsRead: FC<IIsReadProps> = ({ status, isCircleVideo }) => {
	const { theme } = useTheme()
	const color =
		theme === "light" && !isCircleVideo
			? "#57B84C"
			: isCircleVideo
			? "#ffffff"
			: "#71BBFC"
	return (
		<>
			{status === MessageStatus.PENDING && <LuClock3 color={color} />}
			{status === MessageStatus.READ && <LuCheckCheck color={color} />}
			{status === MessageStatus.SENT && <LuCheck color={color} />}
		</>
	)
}
