import { Typography } from "@/shared"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import { useUser } from "@/shared/hooks/useUser"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"
import { LiveControls } from "../../features/LiveControls"
import { HeaderOfLiveStream } from "../HeaderOfLiveStream"
import { ParticipantsList } from "../ParticipantsList"
import { Preview } from "../Preview"

interface ISharingScreenLiveProps {
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

export const SharingScreenLive: FC<ISharingScreenLiveProps> = ({
	statusText,
	description,
	liveApi,
	title,
	isLive,
	remoteVideoStream,
	isScreenSharing,
	isSelfVideoOff,
	localStream,
	isSelfMuted,
	participants,
	remoteStreams,
	handleLeaveClick,
	handleMinimize,
}) => {
	const { user } = useUser()

	const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)

	const liveParticipantUserId = useMemo(() => {
		// Identify participant by the stream currently shown in the preview
		if (currentStream) {
			for (const [peerUserId, stream] of remoteStreams.entries()) {
				if (stream === currentStream) return peerUserId
				try {
					const a = stream.getVideoTracks?.()?.[0]
					const b = currentStream.getVideoTracks?.()?.[0]
					if (a && b && a.id === b.id) return peerUserId
				} catch {}
			}
		}
		// If there is no remote video, but we are sharing (or camera is on), it's us
		if (isScreenSharing || !isSelfVideoOff) return user?.id || null
		return null
	}, [currentStream, remoteStreams, isScreenSharing, isSelfVideoOff, user?.id])

	const hasLiveVideo = (s?: MediaStream | null) =>
		!!s
			?.getVideoTracks?.()
			?.some(t => t.readyState === "live" && !t.muted && (t.enabled ?? true))

	const pickBestStream = useCallback(() => {
		// Prefer any remote stream that currently has a live video track
		for (const stream of remoteStreams.values()) {
			if (hasLiveVideo(stream)) return stream
		}
		// Fallback to our local stream if camera or screen is currently producing video
		if (hasLiveVideo(localStream)) return localStream
		return null
	}, [remoteStreams, localStream])

	// Keep current selection if still valid; otherwise pick the next best stream
	useEffect(() => {
		if (hasLiveVideo(currentStream)) return
		const next = pickBestStream()
		setCurrentStream(next)
	}, [
		remoteStreams,
		isScreenSharing,
		localStream,
		currentStream,
		pickBestStream,
	])

	// If overlay provides a preferred remote stream and our current one isn't live, adopt it
	useEffect(() => {
		if (hasLiveVideo(currentStream)) return
		if (hasLiveVideo(remoteVideoStream)) {
			setCurrentStream(remoteVideoStream)
			return
		}
		// Otherwise try to pick the best available
		const next = pickBestStream()
		setCurrentStream(next)
	}, [remoteVideoStream, currentStream, pickBestStream])

	// React to track state changes (ended/mute/unmute) of the current stream
	useEffect(() => {
		const tracks = currentStream?.getVideoTracks?.() || []
		if (tracks.length === 0) return
		const handleTrackStateChange = () => {
			if (!hasLiveVideo(currentStream)) {
				setCurrentStream(pickBestStream())
			}
		}
		tracks.forEach(t => {
			try {
				t.addEventListener?.("ended", handleTrackStateChange as EventListener)
				t.addEventListener?.("mute", handleTrackStateChange as EventListener)
				t.addEventListener?.("unmute", handleTrackStateChange as EventListener)
			} catch {}
		})
		return () => {
			tracks.forEach(t => {
				try {
					t.removeEventListener?.(
						"ended",
						handleTrackStateChange as EventListener
					)
					t.removeEventListener?.(
						"mute",
						handleTrackStateChange as EventListener
					)
					t.removeEventListener?.(
						"unmute",
						handleTrackStateChange as EventListener
					)
				} catch {}
			})
		}
	}, [
		currentStream,
		remoteStreams,
		isScreenSharing,
		localStream,
		pickBestStream,
	])

	const onSelectStream = (stream: MediaStream | null) => {
		setCurrentStream(stream)
	}

	const liveParticipantName = useMemo(() => {
		return (
			participants.find(p => p.userId === liveParticipantUserId)?.name ||
			(user?.name as string | undefined) ||
			""
		)
	}, [participants, liveParticipantUserId, user?.name])

	return (
		<div
			className={cn(
				"relative flex flex-col m-10 justify-between border border-white/10 w-fit max-w-full h-fit max-h-[calc(100vh-80px)] rounded-lg overflow-hidden bg-[#1A2026] p-2.5"
				// !isVideoOff && "max-h-[calc(100vh-40px)] h-auto"
			)}
		>
			<HeaderOfLiveStream
				title={title}
				description={description}
				statusText={statusText}
			/>

			<div className="w-full h-full flex gap-2.5 justify-between">
				<div className=" min-h-[340px] md:min-h-[420px] lg:min-h-[500px] flex items-center justify-center bg-[#343B46] rounded-lg relative group overflow-hidden">
					<Preview
						isLive={isLive}
						stream={currentStream}
						muted={currentStream === localStream}
						className="px-0"
						classNameVideo="rounded-none"
						fillParent
					/>

					<div className="absolute bottom-0 left-0 w-full flex justify-between items-end">
						<Typography
							tag="p"
							className="text-white text-[14px] !font-normal ml-4 mb-1.5 flex translate-y-10 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-0 duration-200"
						>
							{liveParticipantName}
						</Typography>

						<div className="absolute bottom-0 left-0 translate-y-10 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-10 duration-300 w-full flex justify-center">
							<LiveControls
								isSelfVideoOff={isSelfVideoOff}
								isSelfMuted={isSelfMuted}
								onToggleVideo={liveApi.toggleSelfVideo}
								onToggleMute={liveApi.toggleSelfMute}
								onLeave={handleLeaveClick}
								isScreenSharing={isScreenSharing}
								onToggleScreenShare={liveApi.toggleScreenShare}
								handleMinimize={handleMinimize}
								className="bg-[#1A2026]/90 backdrop-blur-sm rounded-2xl py-3"
							/>
						</div>
						<div className="mr-4 mb-1.5 translate-y-10 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-0 duration-200">
							{participants.find(p => p.userId === liveParticipantUserId)
								?.micOn ? (
								<BiSolidMicrophone size={20} className="text-white" />
							) : (
								<BiSolidMicrophoneOff size={20} className="text-white/60" />
							)}
						</div>
					</div>
				</div>
				<div
					className={cn(
						"max-w-[240px] w-full h-fit overflow-y-auto telegram-scrollbar py-2 bg-[#2C333D] rounded-lg"
					)}
				>
					{isLive ? (
						<div className="flex flex-col gap-1">
							<ParticipantsList
								userId={user?.id}
								participants={participants}
								remoteStreams={remoteStreams}
								localStream={isScreenSharing ? localStream : null}
								isSelfMuted={isSelfMuted}
								isScreenSharing={isScreenSharing}
								onSelect={onSelectStream}
								className="border-none hover:bg-[#343B46] px-3 py-2 w-full rounded-none flex"
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
