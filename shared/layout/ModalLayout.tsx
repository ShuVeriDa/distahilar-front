import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FC, MouseEvent, ReactNode } from "react"
const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IModalLayoutProps {
	isModalOpen: boolean
	onCloseHandler: (e: MouseEvent<HTMLDivElement>) => void
	children: ReactNode
}

export const ModalLayout: FC<IModalLayoutProps> = ({
	isModalOpen,
	onCloseHandler,
	children,
}) => {
	return (
		<AnimatePresence>
			{isModalOpen && (
				<MotionDiv
					className={
						"fixed left-0 top-0 z-[100] flex h-full w-full flex-col items-center justify-center bg-[#000000]/40"
					}
					initial={{ opacity: 0, translateX: "30%" }}
					animate={{ opacity: 1, translateX: "0" }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onClick={onCloseHandler}
				>
					{children}
				</MotionDiv>
			)}
		</AnimatePresence>
	)
}
