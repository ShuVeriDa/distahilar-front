"use client"

import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import dynamic from "next/dynamic"
import { FC } from "react"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"
import { IoVideocam, IoVideocamOff } from "react-icons/io5"
import { MdCallEnd, MdScreenShare, MdStopScreenShare } from "react-icons/md"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)
const AnimatePresence = dynamic(() =>
	import("framer-motion").then(mod => mod.AnimatePresence)
)

type Props = {
	isSelfVideoOff: boolean | undefined
	isSelfMuted: boolean
	onToggleVideo: () => void
	onToggleMute: () => void
	onLeave: () => void
	isScreenSharing?: boolean
	onToggleScreenShare?: () => void
}

export const LiveControls: FC<Props> = ({
	isSelfVideoOff,
	isSelfMuted,
	onToggleVideo,
	onToggleMute,
	onLeave,
	isScreenSharing,
	onToggleScreenShare,
}) => {
	return (
		<div className="w-full max-w-[380px] pb-1 pt-2 px-6 flex self-center items-center justify-between gap-4">
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
				<span className="text-white text-[11px]">Video</span>
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
				<span className="text-white text-[11px]">Share</span>
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
							: "live-gradient-animated_green"
					)}
				>
					<div className="h-[35px] w-[35px] flex items-center justify-center overflow-hidden">
						<AnimatePresence mode="wait" initial={false}>
							{isSelfMuted ? (
								<MotionDiv
									key="muted-icon"
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0.9 }}
									transition={{ duration: 0.12, ease: "easeOut" }}
								>
									<BiSolidMicrophoneOff size={35} />
								</MotionDiv>
							) : (
								<MotionDiv
									key="live-icon"
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0.9 }}
									transition={{ duration: 0.12, ease: "easeOut" }}
								>
									<BiSolidMicrophone size={35} />
								</MotionDiv>
							)}
						</AnimatePresence>
					</div>
				</div>
				<div className="h-[20px] w-full overflow-hidden">
					<AnimatePresence mode="wait" initial={false}>
						{isSelfMuted ? (
							<MotionDiv
								key="muted"
								className="w-full text-center text-white text-[15px]"
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
				<span className="text-white text-[11px] !font-normal">Leave</span>
			</Button>
		</div>
	)
}
