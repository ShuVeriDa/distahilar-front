import { useUser } from "@/shared/hooks/useUser"
import { useClipboard } from "@siberiacancode/reactuse"
import { FC } from "react"

interface ICopyClickBoardProps {}

export const CopyClickBoard: FC<ICopyClickBoardProps> = () => {
	const { user } = useUser()
	const { copy } = useClipboard()
	const onCopy = () => copy(`https://t.me/${user?.username}`)

	return (
		<button
			className="text-[14px] hover:underline text-[#999999] dark:text-[#708499]"
			onClick={onCopy}
		>
			@{user?.username}
		</button>
	)
}
