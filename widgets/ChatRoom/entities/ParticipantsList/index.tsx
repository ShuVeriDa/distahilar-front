"use client"

import { Typography, useUser } from "@/shared"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import Image from "next/image"
import { FC } from "react"
import { LuMic, LuMicOff } from "react-icons/lu"

type Props = {
	participants: LiveParticipantType[]
	remoteStreams: Map<string, MediaStream>
	isSelfMuted: boolean
}

export const ParticipantsList: FC<Props> = ({
	participants,
	remoteStreams,
	isSelfMuted,
}) => {
	const { user } = useUser()

	console.log("ParticipantsList", { participants })

	return (
		<div className="flex flex-col gap-1">
			{participants.map(p => {
				const stream = remoteStreams.get(p.userId)
				return (
					<div
						key={p.userId}
						className="rounded-md overflow-hidden border border-white/10 p-2.5 flex items-center gap-3 bg-[#2C333D]"
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
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<Typography
									tag="p"
									className="text-white text-[14px] font-medium truncate"
								>
									{p.name || p.userId}
								</Typography>
								<span className="text-white/60 text-[12px] capitalize">
									{p.role}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{(p.userId === (user?.id || "") ? !isSelfMuted : p.micOn) ? (
								<LuMic size={18} className="text-white" />
							) : (
								<LuMicOff size={18} className="text-white/60" />
							)}
						</div>
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
