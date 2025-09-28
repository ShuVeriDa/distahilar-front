"use client"

import { Typography } from "@/shared"
import { FC } from "react"

interface ILocalPreview {
	isLive: boolean | undefined
	isSelfVideoOff: boolean | undefined
	localStream: MediaStream | null
	isScreenSharing: boolean | undefined
}

export const LocalPreview: FC<ILocalPreview> = ({
	isLive,
	isSelfVideoOff,
	localStream,
	isScreenSharing,
}) => {
	if (
		!isScreenSharing ||
		!isLive ||
		!localStream ||
		isSelfVideoOff ||
		localStream.getVideoTracks().length === 0
	) {
		return null
	}

	return (
		<div className="w-full mb-2 px-3.5 py-0.5">
			<div className="w-full aspect-video rounded-md overflow-hidden border border-white/10 bg-black">
				<video
					ref={node => {
						if (node && localStream) {
							;(node as HTMLVideoElement).srcObject = localStream
							node.muted = true
							node.autoplay = true
							node.playsInline = true
						}
					}}
					className="w-full h-full object-cover"
				/>
			</div>
			<Typography
				tag="span"
				className="text-white/60 text-[12px] mt-1 block text-center"
			>
				You
			</Typography>
		</div>
	)
}
