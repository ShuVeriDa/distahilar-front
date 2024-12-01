import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { FC } from "react"

interface IModalFooterProps {
	isLoading: boolean
	onClose: () => void
	onSave?: () => Promise<void>
	className?: string
	type?: "submit" | "button"
}

export const ModalFooter: FC<IModalFooterProps> = ({
	isLoading,
	onClose,
	onSave,
	className,
	type = "button",
}) => {
	const CLASSNAME_UPPERDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:top-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

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
				onClick={onClose}
				disabled={isLoading}
			>
				Cancel
			</Button>
			<Button
				variant="withoutBg"
				size="sm"
				type={type}
				onClick={onSave}
				disabled={isLoading}
			>
				Save
			</Button>
		</div>
	)
}
