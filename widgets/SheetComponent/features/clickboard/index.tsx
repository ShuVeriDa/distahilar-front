import { useAppSelector } from "@/shared/lib/redux-store/store"
import { useClipboard } from "@siberiacancode/reactuse"
import { FC } from "react"

interface ICopyClickBoardProps {}

export const CopyClickBoard: FC<ICopyClickBoardProps> = () => {
	const { user } = useAppSelector(state => state.user)
	const { copy } = useClipboard()
	const onCopy = () => copy(`https://t.me/${user?.username}`)

	return (
		<button
			className="text-[14px] hover:underline text-[#0F80D7]"
			onClick={onCopy}
		>
			@{user?.username}
		</button>
	)
}
