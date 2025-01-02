import { useTheme } from "next-themes"
import { FC } from "react"
import { LuCheck, LuCheckCheck } from "react-icons/lu"

interface IIsReadProps {
	isRead: boolean
	isCircleVideo?: boolean
}

export const IsRead: FC<IIsReadProps> = ({ isRead, isCircleVideo }) => {
	const { theme } = useTheme()
	const color =
		theme === "light" && !isCircleVideo
			? "#57B84C"
			: isCircleVideo
			? "#ffffff"
			: "#71BBFC"
	return (
		<>{isRead ? <LuCheckCheck color={color} /> : <LuCheck color={color} />}</>
	)
}
