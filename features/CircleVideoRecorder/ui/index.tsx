// CircleVideoRecorder.tsx
"use client"

import { Recorder } from "@/features/Recorder"
import { MessageEnum } from "@/prisma/models"
import { useEffect, useRef } from "react"

export const CircleVideoRecorder = ({
	stream,
	recordingTime,
	recording,
	shadowColor,
	glowIntensity,
	volume,
	typeMessage,
	stopRecording,
}: {
	stream: MediaStream | null
	recordingTime: number
	recording: boolean
	shadowColor: string
	glowIntensity: number
	volume: number
	typeMessage: MessageEnum
	stopRecording: () => void
}) => {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream
		}
	}, [stream])

	return (
		<div className="w-full h-[calc(100vh-58px)] top-[58px] absolute flex flex-col">
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full ">
				<video
					ref={videoRef}
					autoPlay
					muted
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="absolute bottom-0 h-[47px] w-full bg-white">
				<Recorder
					recording={recording}
					shadowColor={shadowColor}
					glowIntensity={glowIntensity}
					recordingTime={recordingTime}
					volume={volume}
					onCancel={stopRecording}
					typeMessage={typeMessage}
				/>
			</div>
		</div>
	)
}
