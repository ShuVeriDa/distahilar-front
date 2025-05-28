import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/shared/hooks/useUser"
import { cn } from "@/shared/lib/utils/cn"
import { useClipboard } from "@siberiacancode/reactuse"
import { FC } from "react"

interface ICopyClickBoardProps {
	className?: string
}

export const CopyClickBoard: FC<ICopyClickBoardProps> = ({ className }) => {
	const { user } = useUser()
	const { copy } = useClipboard()
	const { toast } = useToast()
	const onCopy = () => {
		copy(`https://t.me/${user?.username}`)

		toast({
			description: "Username copied to clipboard",
			duration: 2000,
		})
	}

	return (
		<button
			className={cn(
				"text-[14px] hover:underline text-[#999999] dark:text-[#708499]",
				className
			)}
			onClick={onCopy}
		>
			@{user?.username}
		</button>
	)
}
