import { useCallback, useEffect, useRef, useState } from "react"

export const useCircleVideoRecorder = () => {
	const [recording, setRecording] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)
	const [volume, setVolume] = useState(0)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)

	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const chunksRef = useRef<Blob[]>([])

	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
	const animationRef = useRef<number | null>(null)
	const timerRef = useRef<NodeJS.Timeout | null>(null)

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

	const cleanup = () => {
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

		stream?.getTracks().forEach(track => track.stop())
		setStream(null)
	}

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

	const startRecording = async () => {
		try {
			const newStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: 480,
					height: 480,
					facingMode: "user",
				},
				audio: true,
			})
			setStream(newStream)

			const audioContext = new AudioContext()
			const analyser = audioContext.createAnalyser()
			const source = audioContext.createMediaStreamSource(newStream)

			source.connect(analyser)
			audioContextRef.current = audioContext
			analyserRef.current = analyser
			sourceRef.current = source

			animateMicrophone()

			const recorder = new MediaRecorder(newStream, {
				mimeType: "video/webm",
			})
			const chunks: Blob[] = []

			recorder.ondataavailable = event => {
				if (event.data.size > 0) chunks.push(event.data)
			}

			recorder.start()

			mediaRecorderRef.current = recorder
			chunksRef.current = chunks
			setRecording(true)
			setRecordingTime(0)
		} catch (error) {
			console.error("Ошибка при записи видео:", error)
		}
	}

	const stopRecording = (): Promise<Blob | null> => {
		return new Promise(resolve => {
			const recorder = mediaRecorderRef.current
			if (!recorder) return resolve(null)

			const chunks: Blob[] = []
			recorder.ondataavailable = e => chunks.push(e.data)
			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: "video/webm" })
				setPreviewUrl(URL.createObjectURL(blob))
				resolve(blob)
			}

			recorder.stop()
			mediaRecorderRef.current = null
			setRecording(false)
			cleanup()
		})
	}

	const glowIntensity = Math.min(volume / 50, 1)
	const shadowColor = `rgba(0, 102, 255, ${glowIntensity})`

	return {
		stream,
		previewUrl,
		recording,
		recordingTime,
		volume,
		glowIntensity,
		shadowColor,
		startRecording,
		stopRecording,
	}
}
