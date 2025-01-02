import { useTheme } from "next-themes"
import { FC } from "react"
import { LuCheck, LuCheckCheck } from "react-icons/lu"

interface IIsReadProps {
	isRead: boolean
}

export const IsRead: FC<IIsReadProps> = ({ isRead }) => {
	const { theme } = useTheme()
	return (
		<>
			{isRead ? (
				<LuCheckCheck color={theme === "light" ? "#57B84C" : "#71BBFC"} />
			) : (
				<LuCheck color={theme === "light" ? "#57B84C" : "#71BBFC"} />
			)}
		</>
	)
}
