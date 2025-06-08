import { MessageEnum } from "@/prisma/models"
import { useCallback, useEffect, useRef, useState } from "react"

export const useMediaRecorder = () => {
	const [typeMessage, setTypeMessage] = useState<MessageEnum>(MessageEnum.TEXT)
	const [recording, setRecording] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [volume, setVolume] = useState(0)

	const streamRef = useRef<MediaStream | null>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const chunksRef = useRef<Blob[]>([])
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const animationRef = useRef<number | null>(null)

	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

	// ⏱️ Таймер записи
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

	const startRecording = async () => {
		try {
			if (
				typeMessage !== MessageEnum.VOICE &&
				typeMessage !== MessageEnum.VIDEO
			) {
				console.warn("Unsupported recording type:", typeMessage)
				return
			}
			const constraints: MediaStreamConstraints = {
				audio: typeMessage === MessageEnum.VOICE ? true : false,
				video:
					typeMessage === MessageEnum.VIDEO
						? { width: 480, height: 480 }
						: false,
			}

			const stream = await navigator.mediaDevices.getUserMedia(constraints)
			streamRef.current = stream
			chunksRef.current = []
			setRecordingTime(0)

			if (typeMessage === MessageEnum.VOICE) {
				const audioContext = new AudioContext()
				const analyser = audioContext.createAnalyser()
				const source = audioContext.createMediaStreamSource(stream)
				source.connect(analyser)

				audioContextRef.current = audioContext
				analyserRef.current = analyser
				sourceRef.current = source
				animateVolume()
			}

			const recorder = new MediaRecorder(stream, {
				mimeType:
					typeMessage === MessageEnum.VIDEO ? "video/webm" : "audio/webm",
			})
			mediaRecorderRef.current = recorder

			recorder.ondataavailable = e => {
				if (e.data.size > 0) chunksRef.current.push(e.data)
			}

			recorder.onstop = () => {
				const blob = new Blob(chunksRef.current, {
					type: typeMessage === MessageEnum.VIDEO ? "video/webm" : "audio/webm",
				})
				setPreviewUrl(URL.createObjectURL(blob))
			}

			recorder.start()
			setRecording(true)
		} catch (err) {
			console.error("Ошибка старта записи:", err)
		}
	}

	const stopRecording = (): Promise<Blob | null> => {
		return new Promise(resolve => {
			if (!mediaRecorderRef.current) return resolve(null)

			const recorder = mediaRecorderRef.current
			recorder.onstop = () => {
				const blob = new Blob(chunksRef.current, {
					type: typeMessage === MessageEnum.VIDEO ? "video/webm" : "audio/webm",
				})
				setPreviewUrl(URL.createObjectURL(blob))
				cleanup()
				resolve(blob)
			}
			recorder.stop()
			setRecording(false)
		})
	}

	const cleanup = () => {
		streamRef.current?.getTracks().forEach(track => track.stop())
		streamRef.current = null
		mediaRecorderRef.current = null
		clearInterval(timerRef.current!)
		timerRef.current = null
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current)
			animationRef.current = null
		}
		if (audioContextRef.current) {
			audioContextRef.current.close()
			audioContextRef.current = null
		}
		setVolume(0)
	}

	const reset = () => {
		setRecording(false)
		setRecordingTime(0)
		setPreviewUrl(null)
		cleanup()
	}

	const animateVolume = useCallback(() => {
		const analyser = analyserRef.current
		if (!analyser) return

		const dataArray = new Uint8Array(analyser.frequencyBinCount)

		const update = () => {
			analyser.getByteFrequencyData(dataArray)
			const avg =
				dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length
			setVolume(avg)
			animationRef.current = requestAnimationFrame(update)
		}

		update()
	}, [])

	// 🔵 Для анимаций (например, микрофон)
	const glowIntensity = Math.min(volume / 50, 1)
	const shadowColor = `rgba(0, 102, 255, ${glowIntensity})`

	return {
		recording,
		recordingTime,
		previewUrl,
		volume,
		glowIntensity,
		shadowColor,
		typeMessage,
		setTypeMessage,
		startRecording,
		stopRecording,
		reset,
	}
}
