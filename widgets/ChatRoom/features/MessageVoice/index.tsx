import { VoiceVideoMessageType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { formatBytes } from "@/shared/lib/utils/formatBytes"
import { formatTimeForAudio } from "@/shared/lib/utils/formatTimeForAudio"
import { FC } from "react"
import { FaPause, FaPlay } from "react-icons/fa"
import { useVoice } from "../../shared/hooks/useVoice"

interface IMessageVoiceProps {
	voice: VoiceVideoMessageType[]
}

export const MessageVoice: FC<IMessageVoiceProps> = ({ voice }) => {
	const {
		containerRef,
		currentTime,
		duration,
		isPlaying,
		isReady,
		onPlayPause,
	} = useVoice(voice)

	const size = formatBytes(voice[0]?.size || 0)

	return (
		<div className="flex items-center gap-3 h-full">
			<Button
				className="w-11 h-11 rounded-full text-white flex items-center justify-center bg-[#5FBE67]"
				onClick={onPlayPause}
				disabled={!isReady}
				variant="default"
			>
				{isPlaying ? <FaPause /> : <FaPlay />}
			</Button>
			<div className="flex flex-col justify-between h-full">
				<div ref={containerRef} />

				<div className="flex gap-2  text-[13px] text-[#5EBD66]">
					<Typography tag="span">
						{currentTime === 0 ? (
							formatTimeForAudio(duration || 0)
						) : (
							<>
								{formatTimeForAudio(currentTime)}&nbsp;/&nbsp;
								{formatTimeForAudio(duration || 0)}
							</>
						)}
					</Typography>

					<Typography tag="span">{size}</Typography>
				</div>
			</div>
		</div>
	)
}
