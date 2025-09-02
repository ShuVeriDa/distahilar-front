import { useCallback, useEffect, useRef, useState } from "react"

export const useCircleVideoRecorder = () => {
	const [recording, setRecording] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)
	const [volume, setVolume] = useState(0)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [permissionStatus, setPermissionStatus] =
		useState<PermissionState | null>(null)

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

	// Функция для проверки и запроса разрешений
	const checkAndRequestPermissions = async () => {
		try {
			// Проверяем, поддерживает ли браузер Permissions API
			if ("permissions" in navigator) {
				// Запрашиваем разрешение на доступ к камере
				const permission = await navigator.permissions.query({
					name: "camera" as PermissionName,
				})
				setPermissionStatus(permission.state)

				// Если разрешение уже предоставлено, возвращаем true
				if (permission.state === "granted") {
					return true
				}

				// Если разрешение отклонено, показываем ошибку
				if (permission.state === "denied") {
					setError(
						"Доступ к камере запрещен. Пожалуйста, разрешите доступ в настройках браузера."
					)
					return false
				}

				// Если разрешение не определено, нужно запросить через getUserMedia
				if (permission.state === "prompt") {
					return true // getUserMedia автоматически запросит разрешение
				}
			}

			// Если Permissions API не поддерживается, просто возвращаем true
			return true
		} catch (error) {
			console.error("Ошибка при проверке разрешений:", error)
			return true // Продолжаем попытку получить доступ
		}
	}

	const startRecording = async () => {
		try {
			setError(null)

			// Проверяем поддержку getUserMedia
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				throw new Error("Ваш браузер не поддерживает доступ к камере")
			}

			// Проверяем разрешения перед запросом доступа
			const hasPermission = await checkAndRequestPermissions()
			if (!hasPermission) {
				return
			}

			// Сначала попробуем получить только видео без аудио
			let newStream: MediaStream

			try {
				// Попробуем получить и видео, и аудио
				newStream = await navigator.mediaDevices.getUserMedia({
					video: {
						width: { ideal: 480, min: 320 },
						height: { ideal: 480, min: 240 },
						facingMode: "user",
						aspectRatio: { ideal: 1 },
					},
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true,
					},
				})
			} catch (videoAudioError) {
				console.log(
					"Не удалось получить аудио, пробуем только видео:",
					videoAudioError
				)

				// Если не удалось получить аудио, пробуем только видео
				try {
					newStream = await navigator.mediaDevices.getUserMedia({
						video: {
							width: { ideal: 480, min: 320 },
							height: { ideal: 480, min: 240 },
							facingMode: "user",
							aspectRatio: { ideal: 1 },
						},
					})
				} catch (videoOnlyError) {
					// Если и видео не удалось получить, пробуем самые базовые настройки
					newStream = await navigator.mediaDevices.getUserMedia({
						video: true,
					})
				}
			}

			setStream(newStream)
			console.log("Поток получен:", newStream)

			// Создаем аудио контекст только если есть аудио треки
			const audioTracks = newStream.getAudioTracks()
			if (audioTracks.length > 0) {
				const audioContext = new AudioContext()
				const analyser = audioContext.createAnalyser()
				const source = audioContext.createMediaStreamSource(newStream)

				source.connect(analyser)
				audioContextRef.current = audioContext
				analyserRef.current = analyser
				sourceRef.current = source

				animateMicrophone()
			}

			// Проверяем поддерживаемые MIME типы
			const supportedTypes = [
				"video/webm;codecs=vp9,opus",
				"video/webm;codecs=vp8,opus",
				"video/webm",
				"video/mp4",
				"video/ogg",
			]

			let mimeType = "video/webm"
			for (const type of supportedTypes) {
				if (MediaRecorder.isTypeSupported(type)) {
					mimeType = type
					break
				}
			}

			const recorder = new MediaRecorder(newStream, {
				mimeType,
			})
			const chunks: Blob[] = []

			recorder.ondataavailable = event => {
				if (event.data.size > 0) chunks.push(event.data)
			}

			recorder.onerror = event => {
				console.error("Ошибка записи:", event)
				setError("Ошибка при записи видео")
			}

			recorder.start()

			mediaRecorderRef.current = recorder
			chunksRef.current = chunks
			setRecording(true)
			setRecordingTime(0)
		} catch (error) {
			console.error("Ошибка при записи видео:", error)

			if (error instanceof DOMException) {
				switch (error.name) {
					case "NotAllowedError":
						setError(
							"Доступ к камере запрещен. Пожалуйста, разрешите доступ к камере в настройках браузера."
						)
						break
					case "NotFoundError":
						setError(
							"Камера не найдена. Убедитесь, что камера подключена и работает."
						)
						break
					case "NotReadableError":
						setError(
							"Камера уже используется другим приложением. Закройте другие приложения, использующие камеру."
						)
						break
					case "OverconstrainedError":
						setError("Запрошенные настройки камеры не поддерживаются.")
						break
					default:
						setError(`Ошибка доступа к камере: ${error.message}`)
				}
			} else {
				setError("Неизвестная ошибка при доступе к камере")
			}
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
