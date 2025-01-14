"use client"

import { VoiceVideoMessageType } from "@/prisma/models"
import { useWavesurfer } from "@wavesurfer/react"
import { useCallback, useEffect, useRef } from "react"

export const useVoice = (voice: VoiceVideoMessageType[]) => {
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

	return {
		containerRef,
		isPlaying,
		isReady,
		currentTime,
		duration,
		onPlayPause,
	}
}
