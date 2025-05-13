import { useCallback, useEffect, useRef, useState } from "react"

export const useVoiceRecord = () => {
	const [recording, setRecording] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)
	const [volume, setVolume] = useState(0)

	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
	const animationRef = useRef<number | null>(null)
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	// Таймер записи
	useEffect(() => {
		if (recording) {
			timerRef.current = setInterval(() => {
				setRecordingTime(prev => prev + 1)
			}, 1000)
		} else {
			clearInterval(timerRef.current!)
		}
		return () => clearInterval(timerRef.current!)
	}, [recording])

	const cleanupAudioContext = () => {
		if (audioContextRef.current) {
			audioContextRef.current.close()
			audioContextRef.current = null
		}
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current)
			animationRef.current = null
		}
		analyserRef.current = null
		sourceRef.current = null
		setVolume(0)
	}

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			})

			const audioContext = new AudioContext()
			const analyser = audioContext.createAnalyser()
			const source = audioContext.createMediaStreamSource(stream)

			source.connect(analyser)
			audioContextRef.current = audioContext
			analyserRef.current = analyser
			sourceRef.current = source

			animateMicrophone()

			const recorder = new MediaRecorder(stream, {
				audioBitsPerSecond: 16000,
			})
			const chunks: Blob[] = []

			recorder.ondataavailable = event => chunks.push(event.data)

			recorder.start()

			mediaRecorderRef.current = recorder
			setRecording(true)
			setRecordingTime(0)
		} catch (error) {
			console.error("Ошибка при записи:", error)
		}
	}

	const stopRecording = (): Promise<Blob | null> => {
		return new Promise(resolve => {
			const recorder = mediaRecorderRef.current
			if (!recorder) return resolve(null)

			const chunks: Blob[] = []
			recorder.ondataavailable = e => chunks.push(e.data)
			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: "audio/webm" })
				resolve(blob)
			}

			recorder.stop()
			mediaRecorderRef.current = null
			setRecording(false)
			cleanupAudioContext()
		})
	}

	// 🔹 Анализируем громкость и обновляем состояние
	const animateMicrophone = useCallback(() => {
		const analyser = analyserRef.current
		if (!analyser) return

		const dataArray = new Uint8Array(analyser.frequencyBinCount)

		const update = () => {
			analyser.getByteFrequencyData(dataArray)
			const avgVolume =
				dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length
			setVolume(avgVolume)
			animationRef.current = requestAnimationFrame(update)
		}

		update()
	}, [])

	// 🔥 Динамическое свечение в зависимости от громкости
	const glowIntensity = Math.min(volume / 50, 1)
	const shadowColor = `rgba(0, 102, 255, ${glowIntensity})`

	return {
		recording,
		volume,
		shadowColor,
		glowIntensity,
		recordingTime,
		startRecording,
		stopRecording,
	}
}
