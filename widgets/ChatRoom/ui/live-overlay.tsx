"use client"

import type { LivePhase } from "@/shared/hooks/useLiveRoom"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { LiveRoomState } from "@/shared/lib/services/live/live.types"
import { FC, useEffect, useMemo, useRef } from "react"
import { LiveMiniPlayer } from "../entities/LiveMiniPlayer"
import { SharingScreenLive } from "../entities/SharingScreenLive"
import { UnSharingScreenLive } from "../entities/UnSharingScreenLive"
import { ConfirmLeaveDialog } from "../features/ConfirmLeaveDialog"

//

interface ILiveOverlayProps {
	chatId: string
	phase: LivePhase
	visible: boolean
	// chat?: ChatType
	isMinimized: boolean
	isSelfMuted: boolean
	liveApi: UseLiveRoomApi
	isScreenSharing?: boolean
	confirmLeaveOpen: boolean
	room: LiveRoomState | null
	isPrivilegedMember: boolean
	nameOfChat: string | undefined
	localStream: MediaStream | null
	participants: LiveParticipantType[]
	isSelfVideoOff: boolean | undefined
	remoteStreams: Map<string, MediaStream>
	// treat as 'anyone sharing' for layout/status purposes
	onClose: () => void
	closeWindowsLive: () => void
	setConfirmLeaveOpen: (value: boolean) => void
	setIsMinimized: (value: boolean) => void
}

export const LiveOverlay: FC<ILiveOverlayProps> = ({
	room,
	phase,
	chatId,
	liveApi,
	visible,
	nameOfChat,
	isSelfMuted,
	localStream,
	isMinimized,
	participants,
	remoteStreams,
	isSelfVideoOff,
	isScreenSharing,
	confirmLeaveOpen,
	isPrivilegedMember,
	onClose,
	setIsMinimized,
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
		if (phase === "live") {
			const base = isSelfMuted ? "Muted" : "Unmuted"
			return isScreenSharing ? `${base} • Sharing screen` : base
		}
		if (phase === "ended") return "Ended"
		return ""
	}, [phase, isSelfMuted, isScreenSharing])

	const handleMinimize = () => {
		setIsMinimized(true)
	}
	const handleMaximize = () => {
		setIsMinimized(false)
	}

	// Pick first remote stream that has an active, unmuted video track
	const remoteVideoStream = useMemo(() => {
		for (const stream of remoteStreams.values()) {
			const tracks = stream.getVideoTracks ? stream.getVideoTracks() : []
			if (
				tracks.some(
					t => t.readyState === "live" && !t.muted && (t.enabled ?? true)
				)
			) {
				return stream
			}
		}
		return null
	}, [remoteStreams])

	if (!visible && !isMinimized) return null
	return (
		<>
			{/* Mini-player when minimized */}
			<LiveMiniPlayer
				title={title}
				isLive={isLive}
				statusText={statusText}
				isMinimized={isMinimized}
				isSelfMuted={isSelfMuted}
				descriptionBase={`${participants.length} participant`}
				onMaximize={handleMaximize}
				remoteStreams={remoteStreams}
				onLeave={handleLeaveClick}
				onToggleMute={liveApi.toggleSelfMute}
			/>

			{/* Full overlay when not minimized */}
			{visible && !isMinimized ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
					onMouseDown={e => {
						if (e.target === e.currentTarget) handleMinimize()
					}}
				>
					{isScreenSharing ? (
						<SharingScreenLive
							title={title}
							isLive={isLive}
							statusText={statusText}
							description={description}
							remoteVideoStream={remoteVideoStream}
							liveApi={liveApi}
							localStream={localStream}
							isSelfMuted={isSelfMuted}
							isScreenSharing={isScreenSharing}
							isSelfVideoOff={isSelfVideoOff}
							participants={participants}
							remoteStreams={remoteStreams}
							isVideoOff={isVideoOff}
							handleMinimize={handleMinimize}
							handleLeaveClick={handleLeaveClick}
						/>
					) : (
						<UnSharingScreenLive
							title={title}
							isLive={isLive}
							statusText={statusText}
							description={description}
							remoteVideoStream={remoteVideoStream}
							liveApi={liveApi}
							localStream={localStream}
							isSelfMuted={isSelfMuted}
							isScreenSharing={isScreenSharing}
							isSelfVideoOff={isSelfVideoOff}
							participants={participants}
							remoteStreams={remoteStreams}
							isVideoOff={isVideoOff}
							handleMinimize={handleMinimize}
							handleLeaveClick={handleLeaveClick}
						/>
					)}
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
