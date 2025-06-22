import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { FC } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

type OnClose = (() => void) & ((onFunc?: () => void) => void)

interface IModalFooterProps {
	isLoading: boolean
	onClose: OnClose
	onSave?: () => Promise<void>
	className?: string
	type?: "submit" | "button"
	isLoadingCircle?: boolean
	anotherName?: string
}

export const ModalFooter: FC<IModalFooterProps> = ({
	isLoading,
	isLoadingCircle,
	className,
	type = "button",
	anotherName = "Save",
	onClose,
	onSave,
}) => {
	const CLASSNAME_UPPERDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:top-0 after:bg-[#E0E0E0] after:dark:bg-[#101921]"

	return (
		<div
			className={cn(
				"flex justify-end gap-2 px-3 py-3",
				CLASSNAME_UPPERDERLINE,
				className
			)}
		>
			<Button
				variant="withoutBg"
				size="sm"
				type="button"
				className={cn(isLoading && "hover:cursor-not-allowed text-gray-500")}
				disabled={isLoading}
				onClick={() => onClose()}
			>
				<Typography className="text-[14px]">Cancel</Typography>
			</Button>
			<Button
				variant="withoutBg"
				size="sm"
				type={type}
				className={cn(isLoading && "hover:cursor-not-allowed text-gray-500")}
				disabled={isLoading}
				onClick={onSave}
			>
				{isLoadingCircle ? (
					<AiOutlineLoading3Quarters className="animate-spin" />
				) : (
					<Typography className="text-[14px]">{anotherName}</Typography>
				)}
			</Button>
		</div>
	)
}
