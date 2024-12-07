import { useClickOutside } from "@siberiacancode/reactuse"
import dynamic from "next/dynamic"
import { FC, ReactNode, useRef } from "react"
import { HiOutlineArrowSmallLeft } from "react-icons/hi2"
import { IoIosClose } from "react-icons/io"
import { cn } from "../lib/utils/cn"
import { Button } from "../ui/Button"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IModalLayoutProps {
	onClose: () => void
	children: ReactNode
	popoverRef?: React.RefObject<HTMLDivElement>
	className?: string
	isXClose?: boolean
	isClickOutside?: boolean
	isLeftArrow?: boolean
	stackIndex?: number
	onClickLeftArrow?: (onFunc?: () => void) => void
	translateX?: number
}

export const ModalLayout: FC<IModalLayoutProps> = ({
	onClose,
	children,
	className,
	isXClose,
	onClickLeftArrow,
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
		<>
			<MotionDiv
				className={cn(
					"fixed left-0 top-0 z-[100] flex h-full w-full flex-col items-center justify-center bg-black/40"
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
					transition={{ duration: 0.2 }}
				>
					{onClickLeftArrow && (
						<Button
							onClick={() => onClickLeftArrow()}
							className="absolute top-3 left-3  cursor-pointer h-[35px] w-[35px]"
						>
							<HiOutlineArrowSmallLeft
								size={25}
								className="text-[#737E87] hover:text-[#c7d0d7] hover:dark:text-white"
							/>
						</Button>
					)}

					{children}

					{isXClose && (
						<Button className="absolute top-3 right-3 cursor-pointer ">
							<IoIosClose
								size={35}
								onClick={onClose}
								className="text-[#737E87] hover:text-[#c7d0d7] hover:dark:text-white"
							/>
						</Button>
					)}
				</MotionDiv>
			</MotionDiv>
		</>
	)
}
