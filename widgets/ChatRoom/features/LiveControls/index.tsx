"use client"

import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import dynamic from "next/dynamic"
import { FC } from "react"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"
import { IoVideocam, IoVideocamOff } from "react-icons/io5"
import { LuMinimize2 } from "react-icons/lu"
import { MdCallEnd, MdScreenShare, MdStopScreenShare } from "react-icons/md"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)
const AnimatePresence = dynamic(() =>
	import("framer-motion").then(mod => mod.AnimatePresence)
)

interface ILiveControls {
	isSelfVideoOff: boolean | undefined
	isSelfMuted: boolean
	isScreenSharing?: boolean
	className?: string
	onToggleVideo: () => void
	onToggleMute: () => void
	onLeave: () => void
	onToggleScreenShare?: () => void
	handleMinimize: () => void
}

export const LiveControls: FC<ILiveControls> = ({
	isSelfVideoOff,
	isSelfMuted,
	isScreenSharing,
	className,
	onToggleVideo,
	onToggleMute,
	onLeave,
	onToggleScreenShare,
	handleMinimize,
}) => {
	return (
		<div
			className={cn(
				"w-full max-w-[380px] pb-1 pt-2 px-6 flex self-center items-center justify-between gap-4",
				className
			)}
		>
			<Button
				variant="clean"
				aria-label={isSelfVideoOff ? "Turn camera on" : "Turn camera off"}
				className="flex flex-col gap-1.5 font-normal"
				onClick={onToggleVideo}
			>
				<div
					className={cn(
						"flex items-center justify-center  text-white p-3 rounded-full",
						isSelfMuted
							? "bg-[#154262] hover:bg-[#163449]"
							: "bg-[#16532C] hover:bg-[#174026]"
					)}
				>
					{isSelfVideoOff ? (
						<IoVideocam size={22} />
					) : (
						<IoVideocamOff size={22} />
					)}
				</div>
				{!isScreenSharing && (
					<span className="text-white text-[11px]">Video</span>
				)}
			</Button>

			<Button
				variant="clean"
				aria-label={isScreenSharing ? "Stop screen share" : "Share screen"}
				className="flex flex-col gap-1.5 font-normal"
				onClick={onToggleScreenShare}
			>
				<div
					className={cn(
						"flex items-center justify-center text-white p-3 rounded-full",
						isScreenSharing
							? "bg-[#534216] hover:bg-[#403617]"
							: "bg-[#154262] hover:bg-[#163449]"
					)}
				>
					{isScreenSharing ? (
						<MdStopScreenShare size={22} />
					) : (
						<MdScreenShare size={22} />
					)}
				</div>
				{!isScreenSharing && (
					<span className="text-white text-[11px]">Share</span>
				)}
			</Button>

			<Button
				variant="clean"
				aria-label={isSelfMuted ? "Unmute" : "You are live"}
				className="flex flex-col gap-1.5 font-normal"
				onClick={onToggleMute}
			>
				<div
					className={cn(
						"relative flex items-center justify-center text-white p-[26px] rounded-full overflow-hidden",
						isSelfMuted
							? "live-gradient-animated_blue"
							: "live-gradient-animated_green",
						isScreenSharing && "p-3"
					)}
				>
					<div
						className={cn(
							"h-[35px] w-[35px] flex items-center justify-center overflow-hidden",
							isScreenSharing && "h-fit w-fit"
						)}
					>
						<AnimatePresence mode="wait" initial={false}>
							{isSelfMuted ? (
								<MotionDiv
									key="muted-icon"
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0.9 }}
									transition={{ duration: 0.12, ease: "easeOut" }}
								>
									<BiSolidMicrophoneOff size={isScreenSharing ? 22 : 35} />
								</MotionDiv>
							) : (
								<MotionDiv
									key="live-icon"
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0.9 }}
									transition={{ duration: 0.12, ease: "easeOut" }}
								>
									<BiSolidMicrophone size={isScreenSharing ? 22 : 35} />
								</MotionDiv>
							)}
						</AnimatePresence>
					</div>
				</div>
				{!isScreenSharing && (
					<div className="h-[20px] w-full overflow-hidden">
						<AnimatePresence mode="wait" initial={false}>
							{isSelfMuted ? (
								<MotionDiv
									key="muted"
									className={cn(
										"w-full text-center text-white text-[15px]",
										isScreenSharing && "text-[12px]"
									)}
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 4 }}
									transition={{ duration: 0.1, ease: "easeOut" }}
								>
									Unmute
								</MotionDiv>
							) : (
								<MotionDiv
									key="live"
									className="w-full text-center text-white text-[15px]"
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 4 }}
									transition={{ duration: 0.1, ease: "easeOut" }}
								>
									You are live
								</MotionDiv>
							)}
						</AnimatePresence>
					</div>
				)}
			</Button>

			<Button
				variant="clean"
				aria-label="Minimize"
				className="flex flex-col gap-1.5"
				onClick={handleMinimize}
			>
				<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
					<LuMinimize2 size={22} />
				</div>
				{!isScreenSharing && (
					<span className="text-white text-[11px] !font-normal">Minimize</span>
				)}
			</Button>

			<Button
				variant="clean"
				aria-label="Leave"
				className="flex flex-col gap-1.5"
				onClick={onLeave}
			>
				<div className="flex items-center justify-center bg-[#883E41] hover:bg-[#8b383b] p-3 rounded-full">
					<MdCallEnd size={22} className="text-white" />
				</div>
				{!isScreenSharing && (
					<span className="text-white text-[11px] !font-normal">Leave</span>
				)}
			</Button>
		</div>
	)
}
