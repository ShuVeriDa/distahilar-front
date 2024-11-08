import { useClickOutside } from "@siberiacancode/reactuse"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FC, ReactNode, useRef } from "react"
import { cn } from "../lib/utils/cn"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IModalLayoutProps {
	isModalOpen: boolean
	onClose: () => void
	children: ReactNode
	className?: string
}

export const ModalLayout: FC<IModalLayoutProps> = ({
	isModalOpen,
	onClose,
	children,
	className,
}) => {
	const ref = useRef<HTMLDivElement>(null)

	useClickOutside(ref, () => onClose())

	return (
		<AnimatePresence>
			{isModalOpen && (
				<MotionDiv
					className={cn(
						"fixed left-0 top-0 z-[100] flex h-full w-full flex-col items-center justify-center bg-black/80"
					)}
					initial={{ opacity: 0, translateX: "30%" }}
					animate={{ opacity: 1, translateX: "0" }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div
						ref={ref}
						className={cn(
							"relative z-[11] w-[400px] rounded-[7px] bg-white dark:bg-[#17212B] p-4 ",
							className
						)}
					>
						{children}
					</div>
				</MotionDiv>
			)}
		</AnimatePresence>
	)
}
