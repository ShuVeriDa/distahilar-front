"use client"

import {
	ConnectionStateToast,
	ControlBar,
	DisconnectButton,
	LiveKitRoom,
	RoomAudioRenderer,
	useTracks,
	VideoConference,
} from "@livekit/components-react"
import "@livekit/components-styles"
import { DisconnectReason, Track } from "livekit-client"
import { FC, useState } from "react"

interface CallRoomProps {
	isOpen: boolean
	callType: "audio" | "video"
	callToken: string
	roomName: string
	isCallActive: boolean
	endCall: () => void
}

export const CallRoom: FC<CallRoomProps> = ({
	isOpen,
	callType,
	callToken,
	roomName,
	isCallActive,
	endCall,
}) => {
	const [connectionError, setConnectionError] = useState<string | null>(null)
	const [preJoinComplete, setPreJoinComplete] = useState(false)
	const [mediaError, setMediaError] = useState<string | null>(null)

	if (!isOpen || !isCallActive || !callToken || !roomName) {
		return null
	}

	const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || ""

	if (!serverUrl) {
		return (
			<div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
				<div className="text-white text-center">
					<h2 className="text-2xl mb-4">Ошибка конфигурации</h2>
					<p className="mb-4">LiveKit URL не настроен</p>
					<button
						onClick={endCall}
						className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
					>
						Закрыть
					</button>
				</div>
			</div>
		)
	}

	const handleDisconnected = (reason?: DisconnectReason) => {
		console.log("Disconnected:", reason)
		if (reason && reason !== DisconnectReason.CLIENT_INITIATED) {
			setConnectionError(`Соединение прервано: ${reason}`)
		}
		endCall()
	}

	// Запрос разрешений перед подключением
	const requestMediaPermissions = async () => {
		try {
			const constraints = {
				audio: true,
				video: callType === "video",
			}

			const stream = await navigator.mediaDevices.getUserMedia(constraints)
			// Сразу останавливаем поток после получения разрешений
			stream.getTracks().forEach(track => track.stop())
			setPreJoinComplete(true)
			setMediaError(null)
		} catch (error: unknown) {
			// Исправлено: заменили any на unknown
			console.error("Media permission error:", error)
			const err = error as { name?: string; message?: string }
			if (err.name === "NotAllowedError") {
				setMediaError(
					"Разрешите доступ к микрофону и камере в настройках браузера"
				)
			} else if (err.name === "NotFoundError") {
				setMediaError("Микрофон или камера не найдены")
			} else if (err.name === "NotReadableError") {
				setMediaError("Микрофон или камера заняты другим приложением")
			} else {
				setMediaError(
					`Ошибка доступа к медиа: ${err.message || "Неизвестная ошибка"}`
				)
			}
		}
	}

	// Показываем ошибку разрешений
	if (mediaError) {
		return (
			<div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
				<div className="text-white text-center max-w-md">
					<h2 className="text-2xl mb-4">Проблема с доступом к медиа</h2>
					<p className="mb-4 text-red-400">{mediaError}</p>
					<div className="space-x-4">
						<button
							onClick={requestMediaPermissions}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
						>
							Попробовать снова
						</button>
						<button
							onClick={endCall}
							className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
						>
							Завершить звонок
						</button>
					</div>
				</div>
			</div>
		)
	}

	// Показываем ошибку соединения
	if (connectionError) {
		return (
			<div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
				<div className="text-white text-center max-w-md">
					<h2 className="text-2xl mb-4">Ошибка подключения</h2>
					<p className="mb-4 text-red-400">{connectionError}</p>
					<div className="space-x-4">
						<button
							onClick={() => {
								setConnectionError(null)
								setPreJoinComplete(false)
							}}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
						>
							Попробовать снова
						</button>
						<button
							onClick={endCall}
							className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
						>
							Завершить звонок
						</button>
					</div>
				</div>
			</div>
		)
	}

	// Если разрешения не получены, показываем экран запроса
	if (!preJoinComplete) {
		return (
			<div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
				<div className="text-white text-center">
					<h2 className="text-2xl mb-4">Подготовка к звонку</h2>
					<p className="mb-6">
						Нужно разрешение на доступ к микрофону
						{callType === "video" ? " и камере" : ""}
					</p>
					<div className="space-x-4">
						<button
							onClick={requestMediaPermissions}
							className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full"
						>
							Разрешить доступ
						</button>
						<button
							onClick={endCall}
							className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
						>
							Отмена
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 z-50 bg-black">
			<LiveKitRoom
				video={callType === "video"}
				audio={true}
				token={callToken}
				serverUrl={serverUrl}
				data-lk-theme="default"
				style={{ height: "100vh" }}
				onDisconnected={handleDisconnected}
				options={{
					publishDefaults: {
						simulcast: false,
						videoSimulcastLayers: [],
					},
					adaptiveStream: false,
					dynacast: false,
				}}
			>
				<CallInterface callType={callType} onEndCall={endCall} />
				<RoomAudioRenderer />
				<ConnectionStateToast />
			</LiveKitRoom>
		</div>
	)
}

interface CallInterfaceProps {
	callType: "audio" | "video"
	onEndCall: () => void
}

const CallInterface: FC<CallInterfaceProps> = ({ callType, onEndCall }) => {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.Microphone, withPlaceholder: false },
		],
		{ onlySubscribed: false }
	)

	if (callType === "video") {
		return (
			<div className="h-full flex flex-col">
				<div className="flex-1">
					<VideoConference />
				</div>
				<div className="p-4">
					<ControlBar
						controls={{
							microphone: true,
							camera: true,
							screenShare: false,
							chat: false,
						}}
					/>
					<div className="flex justify-center mt-4">
						<DisconnectButton className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full">
							Завершить звонок
						</DisconnectButton>
					</div>
				</div>
			</div>
		)
	}

	// Аудио звонок - группируем участников по identity для избежания дубликатов
	const uniqueParticipants = tracks.reduce((acc, track) => {
		const participantId = track.participant.identity
		if (!acc[participantId]) {
			acc[participantId] = track.participant
		}
		return acc
	}, {} as Record<string, (typeof tracks)[0]["participant"]>)

	return (
		<div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
			<div className="text-center text-white mb-8">
				<h2 className="text-2xl font-semibold mb-4">Голосовой звонок</h2>

				<div className="grid gap-8">
					{Object.entries(uniqueParticipants).map(
						([participantId, participant]) => (
							<div
								key={participantId} // Исправлено: используем participantId как уникальный ключ
								className="flex flex-col items-center"
							>
								<div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mb-4">
									<span className="text-2xl font-semibold">
										{participant.name?.charAt(0).toUpperCase()}
									</span>
								</div>

								<div className="text-lg font-medium mb-2">
									{participant.name}
								</div>

								{/* Показываем статус mute для участника */}
								<div className="text-sm opacity-75">
									{participant.isMicrophoneEnabled ? "🎤" : "🔇"}
								</div>
							</div>
						)
					)}
				</div>
			</div>

			<div className="space-y-4">
				<ControlBar
					controls={{
						microphone: true,
						camera: false,
						screenShare: false,
						chat: false,
					}}
				/>

				<div className="flex justify-center">
					<DisconnectButton
						className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium"
						onClick={onEndCall}
					>
						Завершить звонок
					</DisconnectButton>
				</div>
			</div>
		</div>
	)
}
