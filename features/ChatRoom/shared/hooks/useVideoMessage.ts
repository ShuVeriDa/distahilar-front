import { VoiceVideoMessageType } from "@/prisma/models"
import { useCallback, useEffect, useRef, useState } from "react"

export const useVideoMessage = (video: VoiceVideoMessageType[]) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const animationFrameRef = useRef<number | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [remainingTime, setRemainingTime] = useState("00:00")

	const updateProgress = useCallback(() => {
		const videoElement = videoRef.current
		if (videoElement && videoElement.duration) {
			setProgress((videoElement.currentTime / videoElement.duration) * 100)

			// Update remaining time
			const timeLeft = videoElement.duration - videoElement.currentTime
			const minutes = Math.floor(timeLeft / 60)
			const seconds = Math.floor(timeLeft % 60)
			setRemainingTime(
				`${minutes.toString().padStart(2, "0")}:${seconds
					.toString()
					.padStart(2, "0")}`
			)
		}
		if (isPlaying) {
			animationFrameRef.current = requestAnimationFrame(updateProgress)
		}
	}, [isPlaying])

	const togglePlay = useCallback(() => {
		const videoElement = videoRef.current
		if (videoElement) {
			if (isPlaying) {
				videoElement.pause()
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current)
				}
			} else {
				if (progress === 100) {
					videoElement.currentTime = 0
					setProgress(0)
				}
				videoElement.play()
				animationFrameRef.current = requestAnimationFrame(updateProgress)
			}
			setIsPlaying(prev => !prev)
		}
	}, [isPlaying, progress, updateProgress])

	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (progress >= 100) {
			setIsPlaying(false)
		}
	}, [progress])

	useEffect(() => {
		const videoElement = videoRef.current
		if (videoElement) {
			const handleLoadedData = () => {
				videoElement.currentTime = 0
				setProgress(0)

				// Reset remaining time
				const minutes = Math.floor(videoElement.duration / 60)
				const seconds = Math.floor(videoElement.duration % 60)
				setRemainingTime(
					`${minutes.toString().padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
				)
			}
			videoElement.addEventListener("loadeddata", handleLoadedData)
			return () => {
				videoElement.removeEventListener("loadeddata", handleLoadedData)
			}
		}
	}, [video])

	return {
		videoRef,
		progress,
		remainingTime,
		togglePlay,
		updateProgress,
	}
}