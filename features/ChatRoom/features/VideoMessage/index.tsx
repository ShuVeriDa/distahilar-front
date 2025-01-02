import { VoiceVideoMessageType } from "@/prisma/models"
import { FC } from "react"
import { useVideoMessage } from "../../shared/hooks/useVideoMessage"
import { Progress } from "../../shared/ui/Propgress"
import { RemainingTime } from "../../shared/ui/RemainingTime"

interface IVideoMessageProps {
	video: VoiceVideoMessageType[]
}

export const VideoMessage: FC<IVideoMessageProps> = ({ video }) => {
	const { progress, remainingTime, videoRef, togglePlay, updateProgress } =
		useVideoMessage(video)

	return (
		<div className="relative w-[240px] h-[240px]">
			<div className="w-[240px] h-[240px] rounded-full overflow-hidden">
				<video
					ref={videoRef}
					src={video[0].url}
					className="w-full h-full object-cover"
					onClick={togglePlay}
					onTimeUpdate={updateProgress}
				/>
			</div>

			<Progress progress={progress} togglePlay={togglePlay} />

			<RemainingTime remainingTime={remainingTime} />
		</div>
	)
}
