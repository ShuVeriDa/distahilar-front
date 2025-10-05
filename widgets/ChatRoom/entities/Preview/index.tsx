"use client"

import { cn } from "@/shared/lib/utils/cn"
import { FC, useMemo } from "react"

interface IPreviewProps {
	isLive: boolean | undefined
	stream: MediaStream | null
	muted?: boolean
	className?: string
	classNameVideo?: string
	fillParent?: boolean
}

export const Preview: FC<IPreviewProps> = ({
	isLive,
	stream,
	muted,
	className,
	classNameVideo,
	fillParent,
}) => {
	const videoKey = useMemo(() => {
		if (!stream) return "none"
		const videoTracks = stream.getVideoTracks ? stream.getVideoTracks() : []
		const audioTracks = stream.getAudioTracks ? stream.getAudioTracks() : []
		return [...videoTracks, ...audioTracks]
			.map(t => `${t.id}:${t.readyState}:${t.enabled}`)
			.join("|")
	}, [stream])

	if (!isLive || !stream) return null

	return (
		<div
			className={cn(fillParent ? " " : "w-full mb-2 px-3.5 py-0.5", className)}
		>
			<div
				className={cn(
					fillParent
						? "w-fit h-full overflow-hidden "
						: "w-fit aspect-video rounded-md overflow-hidden border border-white/10 ",
					"p-2",
					classNameVideo
				)}
			>
				<video
					key={videoKey}
					ref={node => {
						if (node && stream) {
							;(node as HTMLVideoElement).srcObject = stream
							;(node as HTMLVideoElement).muted = !!muted
							;(node as HTMLVideoElement).autoplay = true
							;(node as HTMLVideoElement).playsInline = true
							try {
								void (node as HTMLVideoElement).play?.()
							} catch {}
						}
					}}
					className={cn(
						"w-full h-full",
						fillParent ? "object-contain" : undefined
					)}
				/>
			</div>
		</div>
	)
}
