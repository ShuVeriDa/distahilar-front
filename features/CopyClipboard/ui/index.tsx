import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/shared/hooks/useUser"
import { cn } from "@/shared/lib/utils/cn"
import { useClipboard } from "@siberiacancode/reactuse"
import { FC } from "react"

interface ICopyClipboardProps {
	className?: string
	username?: string | undefined
}

export const CopyClipboard: FC<ICopyClipboardProps> = ({
	className,
	username,
}) => {
	const { user } = useUser()
	const userName = username ?? user?.username
	const { copy } = useClipboard()
	const { toast } = useToast()
	const onCopy = () => {
		copy(`https://d.hilar/${userName}`)

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
			@{userName}
		</button>
	)
}

