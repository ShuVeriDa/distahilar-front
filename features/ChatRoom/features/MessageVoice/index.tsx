import { VoiceMessageType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { formatTimeForAudio } from "@/shared/lib/utils/formatTimeForAudio"
import { useWavesurfer } from "@wavesurfer/react"
import { FC, useCallback, useEffect, useRef } from "react"
import { FaPause, FaPlay } from "react-icons/fa"

interface IMessageVoiceProps {
	voice: VoiceMessageType[]
}

export const MessageVoice: FC<IMessageVoiceProps> = ({ voice }) => {
	const containerRef = useRef<HTMLDivElement | null>(null)

	const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
		container: containerRef,
		height: 20,
		waveColor: "#B3E2B4",
		progressColor: "#5EBD66",
		cursorWidth: 0,
		// normalize: true,
		barWidth: 2.4,
		barRadius: 10,
		barHeight: 4,
		barGap: 0,
		width: 200,
		url: voice[0].url,
	})

	const onPlayPause = useCallback(() => {
		if (wavesurfer) {
			wavesurfer.playPause()
		}
	}, [wavesurfer])

	const duration = wavesurfer?.getDuration()
	const isStop = currentTime === duration

	useEffect(() => {
		if (isStop) {
			wavesurfer?.stop()
		}
	}, [isStop, wavesurfer])

	return (
		<div className="flex items-center gap-3">
			<Button
				className="w-11 h-11 rounded-full text-white flex items-center justify-center bg-[#5FBE67]"
				onClick={onPlayPause}
				disabled={!isReady}
				variant="default"
			>
				{isPlaying ? <FaPause /> : <FaPlay />}
			</Button>
			<div>
				<div ref={containerRef} />

				<div className="">
					<Typography tag="span" className="text-[13px] text-[#5EBD66]">
						{currentTime === 0 ? (
							formatTimeForAudio(duration || 0)
						) : (
							<>
								{formatTimeForAudio(currentTime)}&nbsp;/&nbsp;
								{formatTimeForAudio(duration || 0)}
							</>
						)}
					</Typography>
				</div>
			</div>
		</div>
	)
}
