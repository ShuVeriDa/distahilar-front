"use client"

import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FC } from "react"
import { PiScreencastFill } from "react-icons/pi"
import { Microphone } from "./shared/ui/Microphone"
import { Title } from "./shared/ui/Title"

interface IParticipantsListProps {
	participants: LiveParticipantType[]
	remoteStreams: Map<string, MediaStream>
	isSelfMuted: boolean
	className?: string
	isScreenSharing: boolean | undefined
	userId: string | undefined
	// optional: allow selecting which stream to preview
	onSelect?: (stream: MediaStream | null) => void
	// provide local screen stream (only when actually sharing) so self can be selected
	localStream?: MediaStream | null
}

export const ParticipantsList: FC<IParticipantsListProps> = ({
	participants,
	remoteStreams,
	isSelfMuted,
	className,
	isScreenSharing,
	userId,
	onSelect,
	localStream,
}) => {
	const t = useTranslations("COMMON")
	console.log({ remoteStreams })

	const getRoleTranslation = (role: string) => {
		switch (role) {
			case "speaker":
				return t("SPEAKER")
			case "listener":
				return t("LISTENER")
			default:
				return role
		}
	}

	const hasLiveVideo = (s?: MediaStream) =>
		!!s
			?.getVideoTracks()
			?.some(t => t.readyState === "live" && !t.muted && (t.enabled ?? true))

	// Determine which participant is currently sharing the screen (or live video)
	const currentSharingUserId = isScreenSharing
		? (() => {
				for (const [peerId, stream] of remoteStreams) {
					if (hasLiveVideo(stream)) return peerId
				}
				return userId || ""
		  })()
		: ""
	return (
		<div className="flex flex-col gap-1">
			{participants.map(p => {
				const stream = remoteStreams.get(p.userId)
				const isSelf = p.userId === userId
				const selectableStream =
					isSelf && localStream ? localStream : stream || null
				const canSelect =
					!!onSelect && hasLiveVideo(selectableStream || undefined)

				const isCurrentParticipantSharingScreen =
					p.userId === currentSharingUserId || currentSharingUserId === userId
				return (
					<div
						key={p.userId}
						className={cn(
							"rounded-md overflow-hidden border border-white/10 p-2.5 flex items-center gap-3 bg-[#2C333D]",
							className
						)}
						onClick={() =>
							canSelect && selectableStream && onSelect?.(selectableStream)
						}
						role={canSelect ? "button" : undefined}
						aria-label={
							canSelect ? `Select ${p.name || p.userId} stream` : undefined
						}
						aria-disabled={canSelect ? undefined : true}
						style={{
							cursor: canSelect ? "pointer" : undefined,
							opacity: canSelect ? 1 : 0.7,
						}}
					>
						{p.imageUrl ? (
							<Image
								src={p.imageUrl}
								alt={p.name || p.userId}
								width={40}
								height={40}
								className="rounded-full object-cover"
							/>
						) : (
							<div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-medium border border-white/20">
								{(p.name || p.userId).slice(0, 2).toUpperCase()}
							</div>
						)}
						{!isScreenSharing ? (
							<>
								<Title
									name={p.name || p.userId}
									role={p.role}
									className="flex-col items-start gap-0"
								/>
								<Microphone
									isSelfMuted={isSelfMuted}
									micOn={p.micOn}
									participantUserId={p.userId}
									userId={userId}
								/>
							</>
						) : (
							<div className="flex flex-col">
								<Title
									name={p.name || p.userId}
									role={p.role}
									isScreenSharing={isScreenSharing}
								/>

								<div className="flex gap-2">
									<Microphone
										isSelfMuted={isSelfMuted}
										micOn={p.micOn}
										participantUserId={p.userId}
										userId={userId}
									/>
									{isCurrentParticipantSharingScreen && (
										<div>
											<PiScreencastFill className="text-white" size={14} />
										</div>
									)}
									<span className="text-white/60 text-[12px] capitalize">
										{getRoleTranslation(p.role)}
									</span>
								</div>
							</div>
						)}

						{stream ? (
							<audio
								ref={node => {
									if (node && stream) {
										;(node as HTMLAudioElement).srcObject = stream
										node.autoplay = true
										node.muted = false
									}
								}}
								className="hidden"
							/>
						) : null}
					</div>
				)
			})}
		</div>
	)
}
