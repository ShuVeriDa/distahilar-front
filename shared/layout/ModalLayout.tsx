import { useClickOutside } from "@siberiacancode/reactuse"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FC, ReactNode, useRef } from "react"
import { IoIosClose } from "react-icons/io"
import { cn } from "../lib/utils/cn"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IModalLayoutProps {
	isCurrentModal: boolean
	onClose: () => void
	children: ReactNode
	popoverRef?: React.RefObject<HTMLDivElement>
	className?: string
	isXClose?: boolean
	stackIndex?: number
	isClickOutside: boolean
	translateX?: number
}

export const ModalLayout: FC<IModalLayoutProps> = ({
	isCurrentModal: isModalOpen,
	onClose,
	children,
	className,
	isXClose,
	popoverRef,
	stackIndex = 0, // принимаем значение стека
	isClickOutside,
	translateX = 30,
}) => {
	const ref = useRef<HTMLDivElement>(null)

	useClickOutside(ref, event => {
		if (
			(popoverRef &&
				popoverRef.current &&
				popoverRef.current.contains(event.target as Node)) ||
			!isClickOutside
		) {
			return
		}
		onClose()
	})

	return (
		<AnimatePresence>
			{isModalOpen && (
				<MotionDiv
					className={cn(
						"fixed left-0 top-0 z-[100] flex h-full w-full flex-col items-center justify-center bg-black/80"
					)}
					style={{ zIndex: 100 + stackIndex }} // Увеличиваем `z-index` по глубине стека
				>
					<MotionDiv
						ref={ref}
						className={cn(
							"relative z-[11] w-[400px] rounded-[7px] bg-white dark:bg-[#17212B] p-4 ",
							className
						)}
						initial={{ opacity: 0, translateX: `${translateX}%` }}
						animate={{ opacity: 1, translateX: "0" }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{children}

						{isXClose && (
							<div className="absolute top-3 right-3 cursor-pointer">
								<IoIosClose
									size={35}
									onClick={onClose}
									className="text-[#737E87] hover:text-[#c7d0d7] hover:dark:text-white"
								/>
							</div>
						)}
					</MotionDiv>
				</MotionDiv>
			)}
		</AnimatePresence>
	)
}
