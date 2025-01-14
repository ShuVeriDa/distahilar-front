import { useCallback, useEffect, useRef, useState } from "react"

export const useVoiceRecord = () =>
	// setValue: UseFormSetValue<IFormRichMessageInput>
	{
		const [recording, setRecording] = useState(false)
		const [audioUrl, setAudioUrl] = useState<string | null>(null)
		const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
			null
		)
		const [recordingTime, setRecordingTime] = useState(0)
		const [volume, setVolume] = useState(0)
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
				if (timerRef.current) {
					clearInterval(timerRef.current)
				}
			}
		}, [recording])

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

				const recorder = new MediaRecorder(stream)
				setMediaRecorder(recorder)
				setRecording(true)
				setRecordingTime(0)

				const chunks: Blob[] = []
				recorder.ondataavailable = event => {
					chunks.push(event.data)
				}

				recorder.onstop = () => {
					const audioBlob = new Blob(chunks, { type: "audio/ogg" })
					setAudioUrl(URL.createObjectURL(audioBlob))
				}

				recorder.start()

				console.log("startRecording", { mediaRecorder })
			} catch (error) {
				console.error("Ошибка при записи:", error)
			}
		}

		const stopRecording = () => {
			if (mediaRecorder) {
				mediaRecorder.stop()
				setRecording(false)

				if (audioContextRef.current) {
					audioContextRef.current.close()
					audioContextRef.current = null
				}

				if (animationRef.current) {
					cancelAnimationFrame(animationRef.current)
					animationRef.current = null
				}

				setVolume(0)
			}
		}

		const onAddVoice = () => {
			stopRecording()
		}

		// 🔹 Анализируем громкость и обновляем состояние
		const animateMicrophone = useCallback(() => {
			if (!analyserRef.current) return

			const analyser = analyserRef.current
			const dataArray = new Uint8Array(analyser.frequencyBinCount)

			const updateAnimation = () => {
				analyser.getByteFrequencyData(dataArray)
				const volumeLevel =
					dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length

				setVolume(volumeLevel)
				animationRef.current = requestAnimationFrame(updateAnimation)
			}

			updateAnimation()
		}, [])

		// 🔥 Динамическое свечение в зависимости от громкости
		const glowIntensity = Math.min(volume / 50, 1)
		const shadowColor = `rgba(0, 102, 255, ${glowIntensity})`

		return {
			recording,
			audioUrl,
			volume,
			shadowColor,
			glowIntensity,
			recordingTime,
			mediaRecorder,
			startRecording,
			stopRecording,
		}
	}
