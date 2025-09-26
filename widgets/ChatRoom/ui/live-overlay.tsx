"use client"

import { Button, Typography } from "@/shared"
import type { LivePhase } from "@/shared/hooks/useLiveRoom"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { LiveRoomState } from "@/shared/lib/services/live/live.types"
import { cn } from "@/shared/lib/utils/cn"
import { FC, useEffect, useMemo, useRef } from "react"
import { LuMinimize2 } from "react-icons/lu"
import { LiveMiniPlayer } from "../entities/LiveMiniPlayer"
import { LocalPreview } from "../entities/LocalPreview"
import { ParticipantsList } from "../entities/ParticipantsList"
import { ConfirmLeaveDialog } from "../features/ConfirmLeaveDialog"
import { LiveControls } from "../features/LiveControls"

//

type Props = {
	chatId: string
	// chat?: ChatType
	isPrivilegedMember: boolean
	room: LiveRoomState | null
	phase: LivePhase
	visible: boolean
	nameOfChat: string | undefined
	liveApi: UseLiveRoomApi
	participants: LiveParticipantType[]
	confirmLeaveOpen: boolean
	remoteStreams: Map<string, MediaStream>
	isSelfMuted: boolean
	isSelfVideoOff: boolean | undefined
	localStream: MediaStream | null
	isMinimized: boolean
	onClose: () => void
	closeWindowsLive: () => void
	setConfirmLeaveOpen: (value: boolean) => void
	setIsMinimized: (value: boolean) => void
}

export const LiveOverlay: FC<Props> = ({
	chatId,
	isPrivilegedMember,
	room,
	phase,
	visible,
	nameOfChat,
	liveApi,
	participants,
	remoteStreams,
	isSelfMuted,
	isSelfVideoOff,
	localStream,
	confirmLeaveOpen,
	isMinimized,
	setIsMinimized,
	onClose,
	closeWindowsLive,
	setConfirmLeaveOpen,
}) => {
	//

	const isVideoOff = isSelfVideoOff

	const title = useMemo(() => {
		if (!room?.isLive) return "Start live stream"
		return nameOfChat
	}, [room, nameOfChat])

	const isLive = room?.isLive

	// Track previous live state to react only on transitions (true -> false)
	const prevIsLiveRef = useRef<boolean | undefined>(isLive)

	const handleLeaveClick = () => {
		if (isPrivilegedMember) {
			setConfirmLeaveOpen(true)
			return
		}
		onClose()
	}

	useEffect(() => {
		const wasLive = prevIsLiveRef.current
		// Close only when live session ends (true -> false),
		// not on initial mount or when starting live (false -> true)
		if (wasLive && !isLive) {
			closeWindowsLive()
			setIsMinimized(false)
		}
		prevIsLiveRef.current = isLive
	}, [closeWindowsLive, isLive, setIsMinimized])

	const description = `${participants.length} participant`

	const statusText = useMemo(() => {
		if (phase === "connecting") return "Connecting…"
		if (phase === "live") return isSelfMuted ? "Muted" : "Unmuted"
		if (phase === "ended") return "Ended"
		return ""
	}, [phase, isSelfMuted])

	const handleMinimize = () => {
		setIsMinimized(true)
	}
	const handleMaximize = () => {
		setIsMinimized(false)
	}

	if (!visible && !isMinimized) return null
	return (
		<>
			{/* Mini-player when minimized */}
			<LiveMiniPlayer
				title={title}
				descriptionBase={`${participants.length} participant`}
				statusText={statusText}
				isSelfMuted={isSelfMuted}
				isLive={isLive}
				isMinimized={isMinimized}
				onMaximize={handleMaximize}
				onLeave={handleLeaveClick}
				onToggleMute={liveApi.toggleSelfMute}
				remoteStreams={remoteStreams}
			/>

			{/* Full overlay when not minimized */}
			{visible && !isMinimized ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
					onMouseDown={e => {
						if (e.target === e.currentTarget) handleMinimize()
					}}
				>
					<div
						className={cn(
							"relative flex flex-col mx-10 justify-between border border-white/10 w-full max-w-[420px] h-full max-h-[580px] rounded-lg overflow-hidden bg-[#1A2026]"
							// !isVideoOff && "max-h-[calc(100vh-40px)] h-auto"
						)}
					>
						<div className="w-full px-6 pt-2 pb-0.5 flex flex-col items-center justify-center ">
							<Typography
								tag="p"
								className="text-white text-[14px] font-medium text-center"
							>
								{title}
							</Typography>
							<Typography
								tag="span"
								className="text-white/60 text-[13px] font-normal text-center"
							>
								{description}
								{statusText ? ` • ${statusText}` : ""}
							</Typography>
						</div>

						{/* Local video preview */}
						<LocalPreview
							isLive={isLive}
							isSelfVideoOff={isSelfVideoOff}
							localStream={localStream}
						/>

						<div
							className={cn(
								"overflow-y-auto px-3.5 py-0.5",
								isVideoOff && "flex-1"
							)}
						>
							{isLive ? (
								<div className="flex flex-col gap-1">
									<ParticipantsList
										participants={participants}
										remoteStreams={remoteStreams}
										isSelfMuted={isSelfMuted}
									/>
								</div>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Typography tag="span" className="text-white/70 text-[15px]">
										No live session. Start one to begin.
									</Typography>
								</div>
							)}
						</div>

						<LiveControls
							isSelfVideoOff={isSelfVideoOff}
							isSelfMuted={isSelfMuted}
							onToggleVideo={liveApi.toggleSelfVideo}
							onToggleMute={liveApi.toggleSelfMute}
							onLeave={handleLeaveClick}
						/>
						<Button
							variant="clean"
							aria-label="Minimize"
							className="flex flex-col gap-1.5 absolute top-2.5 right-2.5"
							onClick={handleMinimize}
						>
							<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-1 rounded-full">
								<LuMinimize2 size={18} />
							</div>
						</Button>
					</div>
				</div>
			) : null}

			{/* Leave/Stop live confirmation for privileged members */}
			{isPrivilegedMember && (
				<ConfirmLeaveDialog
					open={confirmLeaveOpen}
					onOpenChange={setConfirmLeaveOpen}
					chatId={chatId}
					liveApi={liveApi}
					onCloseOverlay={onClose}
				/>
			)}
		</>
	)
}
