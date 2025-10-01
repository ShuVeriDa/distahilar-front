import { FC } from "react"

interface IRemovePreviewProps {
	isLive: boolean | undefined
	remoteVideoStream: MediaStream | null
	remoteVideoKey: string
}

export const RemovePreview: FC<IRemovePreviewProps> = ({
	isLive,
	remoteVideoStream,
	remoteVideoKey,
}) => {
	return isLive && remoteVideoStream ? (
		<div
			className="w-full mb-2 px-3.5 py-0.5"
			aria-label="Remote video preview"
		>
			<div className="w-full aspect-video rounded-md overflow-hidden border border-white/10 bg-black">
				<video
					key={remoteVideoKey}
					ref={node => {
						if (node && remoteVideoStream) {
							;(node as HTMLVideoElement).srcObject = remoteVideoStream
							node.muted = true
							node.autoplay = true
							node.playsInline = true
							try {
								void (node as HTMLVideoElement).play?.()
							} catch {}
						}
					}}
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	) : null
}
