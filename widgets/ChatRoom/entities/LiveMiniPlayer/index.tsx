"use client"

import { Button, Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { FC, useMemo } from "react"
import { LuMaximize2, LuMic, LuMicOff } from "react-icons/lu"
import { MdCallEnd } from "react-icons/md"
import { useMiniDock } from "../../shared/hooks/useMiniDock"

type Props = {
	title: string | undefined
	descriptionBase: string
	statusText: string
	isSelfMuted: boolean
	isLive: boolean | undefined
	isMinimized: boolean
	onMaximize: () => void
	onLeave: () => void
	onToggleMute?: () => void
	remoteStreams: Map<string, MediaStream>
}

export const LiveMiniPlayer: FC<Props> = ({
	title,
	descriptionBase,
	statusText,
	isSelfMuted,
	isLive,
	isMinimized,
	onMaximize,
	onLeave,
	onToggleMute,
	remoteStreams,
}) => {
	const description = useMemo(
		() => `${descriptionBase}${statusText ? ` • ${statusText}` : ""}`,
		[descriptionBase, statusText]
	)

	const {
		miniWrapperRef,
		miniCardRef,
		miniPos,
		isDragging,
		miniAppeared,
		handleMiniPointerDown,
		dockPosition,
	} = useMiniDock({
		isMinimized,
		margins: { top: 103, right: 20, bottom: 52, left: 4 },
	})

	if (!isMinimized || !isLive) return null

	return (
		<div
			ref={miniWrapperRef}
			className={cn(
				"absolute z-50 transition-all duration-200 ease-out",
				!miniPos && dockPosition === "br" && "bottom-[52px] right-5",
				!miniPos && dockPosition === "bl" && "bottom-[52px] left-1",
				!miniPos && dockPosition === "tr" && "top-[103px] right-5",
				!miniPos && dockPosition === "tl" && "top-[103px] left-1"
			)}
			style={
				miniPos
					? {
							top: miniPos.top,
							left: miniPos.left,
							transition: isDragging ? "none" : undefined,
					  }
					: undefined
			}
			onPointerDown={e => handleMiniPointerDown(e.nativeEvent)}
		>
			<div
				ref={miniCardRef}
				className={cn(
					"flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1A2026] border border-white/10 shadow-lg cursor-grab select-none transition-all duration-150",
					miniAppeared
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-1",
					isDragging
						? "scale-[0.97] shadow-2xl active:cursor-grabbing"
						: "hover:shadow-xl"
				)}
			>
				<div className="flex flex-col">
					<Typography
						tag="p"
						className="text-white text-[13px] font-medium truncate max-w-[180px]"
					>
						{title}
					</Typography>
					<Typography tag="span" className="text-white/60 text-[12px]">
						{description}
					</Typography>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="clean"
						aria-label="Restore"
						className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
						onClick={onMaximize}
					>
						<LuMaximize2 size={18} />
					</Button>
					<Button
						variant="clean"
						aria-label={isSelfMuted ? "Unmute" : "Mute"}
						className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
						onClick={onToggleMute}
					>
						{isSelfMuted ? <LuMicOff size={18} /> : <LuMic size={18} />}
					</Button>
					<Button
						variant="clean"
						aria-label="Leave"
						className="bg-[#883E41] hover:bg-[#8b383b] p-2 rounded-full"
						onClick={onLeave}
					>
						<MdCallEnd size={18} className="text-white" />
					</Button>
				</div>
			</div>
			{/* Keep remote audio playing while minimized */}
			<div className="hidden">
				{Array.from(remoteStreams.values()).map((stream, idx) => (
					<audio
						key={idx}
						ref={node => {
							if (node && stream) {
								;(node as HTMLAudioElement).srcObject = stream
								node.autoplay = true
								node.muted = false
							}
						}}
					/>
				))}
			</div>
		</div>
	)
}
