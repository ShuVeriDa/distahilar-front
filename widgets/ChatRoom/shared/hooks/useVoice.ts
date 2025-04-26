"use client"

import { VoiceVideoMessageType } from "@/prisma/models"
import { useWavesurfer } from "@wavesurfer/react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef } from "react"

export const useVoice = (voice: VoiceVideoMessageType[]) => {
	const { theme } = useTheme()
	console.log({ theme })

	const containerRef = useRef<HTMLDivElement | null>(null)

	const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
		container: containerRef,
		height: 20,
		waveColor: theme === "light" ? "#B3E2B4" : "#4B7FB3",
		progressColor: theme === "light" ? "#5EBD66" : "#62B2FD",
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

	return {
		containerRef,
		isPlaying,
		isReady,
		currentTime,
		duration,
		onPlayPause,
	}
}
