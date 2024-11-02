import { useClipboard } from "@siberiacancode/reactuse"
import { FC } from "react"

interface ICopyClickBoardProps {
	username: string
}

export const CopyClickBoard: FC<ICopyClickBoardProps> = ({ username }) => {
	const { copy } = useClipboard()
	const onCopy = () => copy(`https://t.me/${username}`)

	return (
		<button
			className="text-[14px] hover:underline text-[#0F80D7]"
			onClick={onCopy}
		>
			@{username}
		</button>
	)
}
