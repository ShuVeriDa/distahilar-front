import { VoiceVideoMessageType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
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
