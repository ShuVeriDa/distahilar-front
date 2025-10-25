import { Typography } from "@/shared"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"
import { LiveControls } from "../../features/LiveControls"
import { HeaderOfLiveStream } from "../HeaderOfLiveStream"
import { ParticipantsList } from "../ParticipantsList"
import { Preview } from "../Preview"

interface IUnSharingScreenLiveProps {
	statusText: string
	description: string
	liveApi: UseLiveRoomApi
	title: string | undefined
	isLive: boolean | undefined
	remoteVideoStream: MediaStream | null
	isScreenSharing: boolean | undefined
	isSelfVideoOff: boolean | undefined
	localStream: MediaStream | null
	isVideoOff: boolean | undefined
	isSelfMuted: boolean
	participants: LiveParticipantType[]
	remoteStreams: Map<string, MediaStream>
	handleLeaveClick: () => void
	handleMinimize: () => void
}

type ExtendedMediaTrackSettings = MediaTrackSettings & {
	displaySurface?: string
}

export const UnSharingScreenLive: FC<IUnSharingScreenLiveProps> = ({
	title,
	description,
	statusText,
	isLive,
	remoteVideoStream,
	isScreenSharing,
	isVideoOff,
	localStream,
	isSelfVideoOff,
	isSelfMuted,
	participants,
	remoteStreams,
	liveApi,
	handleLeaveClick,
	handleMinimize,
}) => {
	const t = useTranslations("COMMON")
	const selectCameraOnlyStream = (stream: MediaStream | null) => {
		if (!stream) return null
		const videoTracks = stream.getVideoTracks ? stream.getVideoTracks() : []
		const cameraTrack = videoTracks.find(t => {
			try {
				const settings = (t.getSettings?.() || {}) as ExtendedMediaTrackSettings
				// If displaySurface present, it's a display capture; skip it
				if (settings.displaySurface) return false
				// If facingMode exists, it's likely camera
				if (settings.facingMode) return true
			} catch {}
			const label = (t.label || "").toLowerCase()
			return (
				!label.includes("screen") &&
				!label.includes("display") &&
				!label.includes("window") &&
				!label.includes("tab")
			)
		})
		if (!cameraTrack) return null
		const out = new MediaStream()
		out.addTrack(cameraTrack)
		return out
	}

	const cameraRemoteStream = useMemo(
		() => selectCameraOnlyStream(remoteVideoStream),
		[remoteVideoStream]
	)
	const cameraLocalStream = useMemo(
		() => selectCameraOnlyStream(localStream),
		[localStream]
	)

	return (
		<div
			className={cn(
				"relative flex flex-col mx-10 justify-between border border-white/10 w-full max-w-[430px] h-full max-h-[580px] rounded-lg overflow-hidden bg-[#1A2026]"
				// !isVideoOff && "max-h-[calc(100vh-40px)] h-auto"
			)}
		>
			<HeaderOfLiveStream
				title={title}
				description={description}
				statusText={statusText}
			/>

			{/* Unified preview - show camera video only */}
			<Preview
				isLive={isLive}
				stream={cameraRemoteStream || cameraLocalStream}
				muted={!!cameraLocalStream && !cameraRemoteStream}
			/>

			<div
				className={cn("overflow-y-auto px-3.5 py-0.5", isVideoOff && "flex-1")}
			>
				{isLive ? (
					<div className="flex flex-col gap-1">
						<ParticipantsList
							participants={participants}
							remoteStreams={remoteStreams}
							isSelfMuted={isSelfMuted}
							isScreenSharing={isScreenSharing}
							userId={undefined}
						/>
					</div>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Typography tag="span" className="text-white/70 text-[15px]">
							{t("NO_LIVE_SESSION")}
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
				isScreenSharing={isScreenSharing}
				onToggleScreenShare={liveApi.toggleScreenShare}
				handleMinimize={handleMinimize}
			/>
		</div>
	)
}
