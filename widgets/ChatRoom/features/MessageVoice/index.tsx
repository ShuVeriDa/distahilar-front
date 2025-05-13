import { VoiceVideoMessageType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { formatBytes } from "@/shared/lib/utils/formatBytes"
import { formatTimeForAudio } from "@/shared/lib/utils/formatTimeForAudio"
import { FC } from "react"
import { FaPause, FaPlay } from "react-icons/fa"
import { useVoice } from "../../shared/hooks/useVoice"

interface IMessageVoiceProps {
	voice: VoiceVideoMessageType[]
	isMyMessage: boolean
}

export const MessageVoice: FC<IMessageVoiceProps> = ({
	voice,
	isMyMessage,
}) => {
	const {
		containerRef,
		currentTime,
		duration,
		isPlaying,
		isReady,
		onPlayPause,
	} = useVoice(voice)

	const size = formatBytes((voice ? voice[0]?.size : 0) || 0)

	return (
		<div className="flex items-center gap-3 h-full">
			<Button
				className={cn(
					"w-11 h-11 rounded-full text-white flex items-center justify-center ",
					isMyMessage
						? "bg-[#5FBE67] dark:bg-[#4C9CE2]"
						: "bg-[#40A7E3] dark:bg-[#3F96D0]"
				)}
				onClick={onPlayPause}
				disabled={!isReady}
				variant="default"
			>
				{isPlaying ? <FaPause /> : <FaPlay />}
			</Button>
			<div className="flex flex-col justify-between h-full">
				<div ref={containerRef} />

				<div
					className={cn(
						"flex gap-2  text-[13px] text-[#5EBD66] dark:dark:text-[#488DD3]",
						isMyMessage
							? "text-[#5EBD66] dark:dark:text-[#488DD3]"
							: "text-[#A0ACB6] dark:text-[#6D7F8F]"
					)}
				>
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
