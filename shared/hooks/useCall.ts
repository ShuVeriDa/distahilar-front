import { useCallback, useEffect, useState } from "react"
import {
	CallActionEnum,
	CallNotification,
	CallResponse,
	CallStatusEnum,
	InitiateCallDto,
} from "../lib/services/call/call.types"
import { useSocket } from "../providers/SocketProvider"
import { useUser } from "./useUser"

export type CallType = "audio" | "video"

interface CallState {
	isCallModalOpen: boolean
	isIncomingCallModalOpen: boolean
	isCallActive: boolean
	callType: CallType
	currentChatId: string | null
	currentCallId: string | null
	incomingCall: CallNotification | null
	callToken: string | null
	roomName: string | null
	isConnecting: boolean
	callError: string | null
}

export const useCall = () => {
	const { socket } = useSocket()
	const { user } = useUser()

	const [callState, setCallState] = useState<CallState>({
		isCallModalOpen: false,
		isIncomingCallModalOpen: false,
		isCallActive: false,
		callType: "audio",
		currentChatId: null,
		currentCallId: null,
		incomingCall: null,
		callToken: null,
		roomName: null,
		isConnecting: false,
		callError: null,
	})

	// WebSocket обработчики
	useEffect(() => {
		if (!socket) return

		const handleIncomingCall = (notification: CallNotification) => {
			console.log("Incoming call received:", notification)
			setCallState(prev => ({
				...prev,
				incomingCall: notification,
				isIncomingCallModalOpen: true,
			}))
		}

		const handleCallResponse = (response: CallResponse) => {
			console.log("Call response received:", response)

			if (response.status === "rejected") {
				setCallState(prev => ({
					...prev,
					isCallModalOpen: false,
					isIncomingCallModalOpen: false,
					isConnecting: false,
					callError: "Звонок отклонен",
					incomingCall: null,
				}))
			} else if (response.status === CallStatusEnum.ACTIVE) {
				console.log("Call is active, tokens:", response.tokens)
				console.log("User ID:", user?.id)

				const userToken = response.tokens?.[user?.id || ""]
				console.log("Selected token:", userToken)

				setCallState(prev => ({
					...prev,
					isCallModalOpen: false,
					isIncomingCallModalOpen: false,
					isConnecting: false,
					isCallActive: true,
					callToken: userToken || null,
					roomName: response.roomName || null,
					incomingCall: null,
					callError: userToken ? null : "Токен не получен",
				}))
			}
		}

		const handleCallEnded = (callEnd: any) => {
			console.log("Call ended:", callEnd)
			setCallState(prev => ({
				...prev,
				isCallActive: false,
				isCallModalOpen: false,
				isIncomingCallModalOpen: false,
				isConnecting: false,
				currentCallId: null,
				currentChatId: null,
				callToken: null,
				roomName: null,
				incomingCall: null,
			}))
		}

		socket.on("incomingCall", handleIncomingCall)
		socket.on("callResponse", handleCallResponse)
		socket.on("callEnded", handleCallEnded)

		return () => {
			socket.off("incomingCall", handleIncomingCall)
			socket.off("callResponse", handleCallResponse)
			socket.off("callEnded", handleCallEnded)
		}
	}, [socket, user])

	// Таймаут для состояния подключения
	useEffect(() => {
		if (callState.isConnecting) {
			const timeout = setTimeout(() => {
				console.log("Connection timeout reached")
				setCallState(prev => ({
					...prev,
					isConnecting: false,
					callError: "Превышено время ожидания подключения",
				}))
			}, 15000) // Уменьшили до 15 секунд

			return () => clearTimeout(timeout)
		}
	}, [callState.isConnecting])

	const openCallModal = useCallback((chatId: string) => {
		setCallState(prev => ({
			...prev,
			currentChatId: chatId,
			isCallModalOpen: true,
			callError: null,
		}))
	}, [])

	const closeCallModal = useCallback(() => {
		setCallState(prev => ({
			...prev,
			isCallModalOpen: false,
			currentChatId: null,
			isConnecting: false,
			callError: null,
		}))
	}, [])

	const startCall = useCallback(
		(type: CallType) => {
			if (!socket || !callState.currentChatId) return

			console.log("Starting call:", { type, chatId: callState.currentChatId })

			setCallState(prev => ({
				...prev,
				callType: type,
				isConnecting: true,
				callError: null,
			}))

			const callData: InitiateCallDto = {
				chatId: callState.currentChatId,
				isVideoCall: type === "video",
			}

			socket.emit("initiateCall", callData, (response: any) => {
				console.log("Initiate call response:", response)
				if (response?.error) {
					setCallState(prev => ({
						...prev,
						isConnecting: false,
						callError: response.error,
					}))
				} else if (response?.callId) {
					setCallState(prev => ({
						...prev,
						currentCallId: response.callId,
					}))
				}
			})
		},
		[socket, callState.currentChatId]
	)

	const answerCall = useCallback(
		(accept: boolean) => {
			if (!socket || !callState.incomingCall) return

			console.log("Answering call:", {
				accept,
				callId: callState.incomingCall.callId,
			})

			const responseData = {
				callId: callState.incomingCall.callId,
				action: accept ? CallActionEnum.ACCEPT : CallActionEnum.REJECT,
			}

			if (accept) {
				setCallState(prev => ({
					...prev,
					isIncomingCallModalOpen: false,
					isConnecting: true,
					callType: prev.incomingCall?.isVideoCall ? "video" : "audio",
					currentCallId: prev.incomingCall?.callId || null,
					currentChatId: prev.incomingCall?.chatId || null,
				}))

				// Отправляем ответ на сервер с callback
				socket.emit("respondToCall", responseData, (serverResponse: any) => {
					console.log("Respond to call server response:", serverResponse)

					if (serverResponse?.error) {
						setCallState(prev => ({
							...prev,
							isConnecting: false,
							callError: serverResponse.error,
						}))
					} else if (serverResponse) {
						// Обрабатываем ответ сразу если пришел через callback
						const userToken = serverResponse.tokens?.[user?.id || ""]
						console.log("Token from callback:", userToken)

						if (userToken && serverResponse.roomName) {
							setCallState(prev => ({
								...prev,
								isConnecting: false,
								isCallActive: true,
								callToken: userToken,
								roomName: serverResponse.roomName,
								incomingCall: null,
							}))
						} else {
							setCallState(prev => ({
								...prev,
								isConnecting: false,
								callError: "Не удалось получить токен для подключения",
							}))
						}
					}
				})
			} else {
				// Отклонение звонка
				socket.emit("respondToCall", responseData)
				setCallState(prev => ({
					...prev,
					isIncomingCallModalOpen: false,
					incomingCall: null,
				}))
			}
		},
		[socket, callState.incomingCall, user?.id]
	)

	const endCall = useCallback(() => {
		if (!socket || !callState.currentCallId) {
			setCallState(prev => ({
				...prev,
				isCallActive: false,
				isCallModalOpen: false,
				isIncomingCallModalOpen: false,
				isConnecting: false,
				currentCallId: null,
				currentChatId: null,
				callToken: null,
				roomName: null,
				incomingCall: null,
			}))
			return
		}

		console.log("Ending call:", callState.currentCallId)
		socket.emit("endCall", { callId: callState.currentCallId })

		setCallState(prev => ({
			...prev,
			isCallActive: false,
			isCallModalOpen: false,
			isIncomingCallModalOpen: false,
			isConnecting: false,
			currentCallId: null,
			currentChatId: null,
			callToken: null,
			roomName: null,
			incomingCall: null,
		}))
	}, [socket, callState.currentCallId])

	const joinVoiceChat = useCallback(
		(chatId: string) => {
			if (!socket) return

			socket.emit("joinVoiceChat", { chatId }, (response: any) => {
				if (response.error) {
					setCallState(prev => ({
						...prev,
						callError: response.error,
					}))
				} else {
					setCallState(prev => ({
						...prev,
						isCallActive: true,
						callType: "audio",
						currentChatId: chatId,
						callToken: response.token,
						roomName: response.roomName,
					}))
				}
			})
		},
		[socket]
	)

	return {
		...callState,
		openCallModal,
		closeCallModal,
		startCall,
		answerCall,
		endCall,
		joinVoiceChat,
	}
}
