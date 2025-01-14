import { Typography } from "@/shared"
import { formatRecordingTime } from "@/shared/lib/utils/formatRecordingTime"
import { useEffect, useRef, useState } from "react"

export const RecordingTimer = ({
	recordingTime,
	recording,
}: {
	recordingTime: number
	recording: boolean
}) => {
	const [displayTime, setDisplayTime] = useState(recordingTime)
	const [isBlinking, setIsBlinking] = useState(true)
	const startTimeRef = useRef(performance.now())

	useEffect(() => {
		if (!recording) return
		startTimeRef.current = performance.now()

		const update = () => {
			const elapsedTime = (performance.now() - startTimeRef.current) / 1000
			setDisplayTime(recordingTime + elapsedTime)
			requestAnimationFrame(update)
		}

		const animationFrameId = requestAnimationFrame(update)

		return () => cancelAnimationFrame(animationFrameId)
	}, [recordingTime, recording])

	useEffect(() => {
		if (!recording) return
		const blinkInterval = setInterval(() => {
			setIsBlinking(prev => !prev)
		}, 500) // Мигание раз в 500 мс

		return () => clearInterval(blinkInterval)
	}, [recording])

	return (
		<div className="flex items-center space-x-3">
			<div
				className={`w-2.5 h-2.5 rounded-full ${
					isBlinking ? "bg-red-500" : "bg-transparent"
				} transition-colors`}
			></div>
			<Typography tag="span" className="text-black text-[13px]">
				{formatRecordingTime(displayTime)}
			</Typography>
		</div>
	)
}
