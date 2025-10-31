"use client"

import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"

interface WaveSurferPlayerProps {
	audioUrl: string
	// playAudio: () => void
	// paused: boolean
}

const WaveSurferPlayer: React.FC<WaveSurferPlayerProps> = ({
	audioUrl,
	// paused,
	// playAudio,
}) => {
	const waveformRef = useRef<HTMLDivElement | null>(null)
	const wavesurferRef = useRef<WaveSurfer | null>(null)
	const [playing, setPlaying] = useState(false)

	useEffect(() => {
		if (waveformRef.current) {
			wavesurferRef.current = WaveSurfer.create({
				container: waveformRef.current,
				waveColor: "#4CAF50",
				progressColor: "#FF9800",
				cursorColor: "transparent",
				barWidth: 2,
				// responsive: true,
				height: 40,
			})

			wavesurferRef.current.load(audioUrl)

			wavesurferRef.current.on("finish", () => {
				setPlaying(false)
			})
		}

		return () => {
			wavesurferRef.current?.destroy()
		}
	}, [audioUrl])

	const togglePlay = () => {
		// if (paused) {
		// 	playAudio()
		// }
		// if (!paused && wavesurferRef.current) {
		if (wavesurferRef.current) {
			wavesurferRef.current.playPause()
			setPlaying(!playing)
		}
	}

	return (
		<div className="flex items-center space-x-2">
			<button onClick={togglePlay} className="p-2 bg-gray-600 rounded-full">
				{playing ? "⏸" : "▶"}
			</button>
			<div ref={waveformRef} className="w-full"></div>
		</div>
	)
}

export default WaveSurferPlayer
