import { VoiceVideoMessageType } from "@/prisma/models"
import { Skeleton } from "@/shared"
import { formatDuration } from "@/shared/lib/utils/formatDuration"
import { FC } from "react"
import { useVideoMessage } from "../../shared/hooks/useVideoMessage"
import { Progress } from "../../shared/ui/Propgress"
import { RemainingTime } from "../../shared/ui/RemainingTime"

interface IVideoMessageProps {
	video: VoiceVideoMessageType[]
}

export const VideoMessage: FC<IVideoMessageProps> = ({ video }) => {
	const {
		progress,
		remainingTime,
		videoRef,
		isPlaying,
		togglePlay,
		updateProgress,
	} = useVideoMessage(video)

	const formattedDuration = isPlaying
		? remainingTime
		: formatDuration(video ? video[0].duration : 0)

	return (
		<div className="relative w-[240px] h-[240px]">
			<div className="w-[240px] h-[240px] rounded-full overflow-hidden">
				{video ? (
					<video
						ref={videoRef}
						src={video[0].url}
						className="w-full h-full object-cover"
						onClick={togglePlay}
						onTimeUpdate={updateProgress}
					/>
				) : (
					<Skeleton className="w-full h-full rounded-full bg-[#F1F1F1] dark:bg-[#202B38]" />
				)}
			</div>

			<Progress progress={progress} togglePlay={togglePlay} />

			<RemainingTime remainingTime={formattedDuration} />
		</div>
	)
}
