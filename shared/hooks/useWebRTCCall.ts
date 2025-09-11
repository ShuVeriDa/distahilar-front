"use client"

"use client"

import { toast } from "@/hooks/use-toast"
import {
	CallActionEnum,
	CallPhaseEnum,
	CallStatusEnum,
	CallTypeEnum,
	WebRtcAnswerDto,
	WebRtcIceCandidateDto,
	WebRtcOfferDto,
} from "@/shared/lib/services/call/call.types"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export interface UseWebRTCCallState {
	callId: string | null
	phase: CallPhaseEnum
	isVideoCall: boolean
	localStream: MediaStream | null
	remoteStream: MediaStream | null
	isRemoteVideoOn: boolean
	peerUserId: string | null
}

export interface UseWebRTCCallApi {
	startCall: (params: {
		chatId: string
		peerUserId: string
		isVideoCall?: boolean
	}) => Promise<void>
	acceptIncomingCall: () => void
	rejectIncomingCall: () => void
	endCall: () => void
	toggleMute: () => void
	toggleCamera: () => void
}

const iceServers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }]

export const useWebRTCCall = (): [UseWebRTCCallState, UseWebRTCCallApi] => {
	const { socket } = useSocket()
	const [state, setState] = useState<UseWebRTCCallState>({
		callId: null,
		phase: CallPhaseEnum.IDLE,
		isVideoCall: false,
		localStream: null,
		remoteStream: null,
		isRemoteVideoOn: false,
		peerUserId: null,
	})

	const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
	const pendingRemoteIceRef = useRef<RTCIceCandidateInit[]>([])
	const remoteVideoTrackRef = useRef<MediaStreamTrack | null>(null)
	const remoteTrackCleanupRef = useRef<(() => void) | null>(null)
	const acceptedRef = useRef(false)
	const answeredRef = useRef(false)

	const cleanup = useCallback(() => {
		acceptedRef.current = false
		answeredRef.current = false
		remoteTrackCleanupRef.current?.()
		remoteTrackCleanupRef.current = null
		remoteVideoTrackRef.current = null
		peerConnectionRef.current?.getSenders().forEach(sender => {
			try {
				sender.track?.stop()
			} catch {}
		})
		peerConnectionRef.current?.close()
		peerConnectionRef.current = null
		state.localStream?.getTracks().forEach(t => t.stop())
		setState(prev => ({ ...prev, isRemoteVideoOn: false }))
	}, [state.localStream])

	const createPeerConnection = useCallback(() => {
		const pc = new RTCPeerConnection({ iceServers })

		pc.onicecandidate = event => {
			if (!event.candidate || !socket || !state.callId || !state.peerUserId)
				return
			const dto: WebRtcIceCandidateDto = {
				callId: state.callId,
				toUserId: state.peerUserId,
				candidate: event.candidate.toJSON(),
			}
			socket.emit("webrtcIceCandidate", dto)
		}

		pc.ontrack = event => {
			const [remoteStream] = event.streams
			setState(prev => ({ ...prev, remoteStream }))

			if (event.track.kind === "video") {
				// Cleanup previous listeners if any
				remoteTrackCleanupRef.current?.()
				remoteTrackCleanupRef.current = null

				remoteVideoTrackRef.current = event.track
				const handleMute = () =>
					setState(prev => ({ ...prev, isRemoteVideoOn: false }))
				const handleUnmute = () =>
					setState(prev => ({ ...prev, isRemoteVideoOn: true }))
				const handleEnded = () =>
					setState(prev => ({ ...prev, isRemoteVideoOn: false }))

				event.track.addEventListener("mute", handleMute)
				event.track.addEventListener("unmute", handleUnmute)
				event.track.addEventListener("ended", handleEnded)

				// Initial status
				const isOn = event.track.readyState === "live" && !event.track.muted
				setState(prev => ({ ...prev, isRemoteVideoOn: isOn }))

				remoteTrackCleanupRef.current = () => {
					event.track.removeEventListener("mute", handleMute)
					event.track.removeEventListener("unmute", handleUnmute)
					event.track.removeEventListener("ended", handleEnded)
				}
			}
		}

		pc.onconnectionstatechange = () => {
			const st = pc.connectionState
			if (st === "connected") {
				setState(prev => ({ ...prev, phase: CallPhaseEnum.ACTIVE }))
			} else if (st === "disconnected" || st === "failed") {
				cleanup()
				setState(prev => ({ ...prev, phase: CallPhaseEnum.ENDED }))
			}
		}

		peerConnectionRef.current = pc
		return pc
	}, [cleanup, socket, state.callId, state.peerUserId])

	const getLocalStream = useCallback(async (isVideo: boolean) => {
		let devices: MediaDeviceInfo[] = []
		try {
			devices = await navigator.mediaDevices.enumerateDevices()
		} catch {}

		const hasMic = devices.some(d => d.kind === "audioinput")
		const hasCam = devices.some(d => d.kind === "videoinput")
		const wantVideo = isVideo && hasCam
		console.log({ hasMic, hasCam, wantVideo })

		const tryGet = async (c: MediaStreamConstraints) =>
			await navigator.mediaDevices.getUserMedia(c)

		try {
			const stream = await tryGet({
				audio: hasMic
					? { echoCancellation: true, noiseSuppression: true }
					: false,
				video: wantVideo
					? {
							width: { ideal: 640 },
							height: { ideal: 480 },
							facingMode: "user",
					  }
					: false,
			})
			setState(prev => ({ ...prev, localStream: stream }))
			return stream
		} catch (err: unknown) {
			// Fallbacks
			if (wantVideo && hasMic) {
				try {
					const stream = await tryGet({ audio: true, video: false })
					setState(prev => ({
						...prev,
						isVideoCall: false,
						localStream: stream,
					}))
					toast({
						description: "Камера не найдена. Продолжаем как аудиозвонок.",
						duration: 3000,
					})
					return stream
				} catch {}
			}
			if (!hasMic && hasCam && isVideo) {
				try {
					const stream = await tryGet({ audio: false, video: true })
					setState(prev => ({ ...prev, localStream: stream }))
					toast({
						description: "Микрофон не найден. Видео без звука.",
						duration: 3000,
					})
					return stream
				} catch {}
			}

			let name = "Error"
			if (typeof err === "object" && err !== null) {
				const e = err as { name?: string; code?: string }
				name = e.name || e.code || "Error"
			}
			if (name === "NotFoundError" || name === "OverconstrainedError") {
				toast({
					description: "Устройства не найдены: проверьте микрофон/камеру.",
					duration: 3500,
				})
			} else if (name === "NotAllowedError" || name === "SecurityError") {
				toast({
					description: "Доступ к камере/микрофону запрещен.",
					duration: 3500,
				})
				toast({
					description: "Доступ к камере/микрофону запрещен.",
					duration: 3500,
				})
			} else {
				toast({
					description: "Не удалось получить медиа-устройства.",
					duration: 3500,
				})
			}
			throw err
		}
	}, [])

	const attachLocalTracks = (pc: RTCPeerConnection, stream: MediaStream) => {
		stream.getTracks().forEach(track => pc.addTrack(track, stream))
	}

	const startCall = useCallback(
		async ({
			chatId,
			peerUserId,
			isVideoCall = false,
		}: {
			chatId: string
			peerUserId: string
			isVideoCall?: boolean
		}) => {
			if (!socket) return
			setState(prev => ({
				...prev,
				phase: CallPhaseEnum.CALLING,
				isVideoCall,
				peerUserId,
			}))

			// 1) Ask backend to initiate the call (will notify callee)
			socket.emit(
				"initiateCall",
				{ chatId, isVideoCall },
				async (res: { callId: string }) => {
					const callId = res?.callId
					setState(prev => ({ ...prev, callId }))

					// 2) Prepare WebRTC offer and send via signaling
					const pc = createPeerConnection()
					try {
						const local = await getLocalStream(isVideoCall)
						attachLocalTracks(pc, local)
					} catch {
						pc.close()
						peerConnectionRef.current = null
						setState(prev => ({
							...prev,
							phase: CallPhaseEnum.IDLE,
							isVideoCall: false,
						}))
						return
					}

					const offer = await pc.createOffer({
						offerToReceiveAudio: true,
						offerToReceiveVideo: isVideoCall,
					})
					await pc.setLocalDescription(offer)

					const dto: WebRtcOfferDto = {
						callId,
						toUserId: peerUserId,
						sdp: offer.sdp || "",
						type: CallTypeEnum.OFFER,
					}
					socket.emit("webrtcOffer", dto)
					setState(prev => ({ ...prev, phase: CallPhaseEnum.CONNECTING }))
				}
			)
		},
		[createPeerConnection, getLocalStream, socket]
	)

	const maybeCreateAndSendAnswer = useCallback(async () => {
		const pc = peerConnectionRef.current
		if (
			!socket ||
			!state.callId ||
			!state.peerUserId ||
			!pc ||
			answeredRef.current === true ||
			acceptedRef.current !== true
		)
			return

		// Only answer when we truly have a remote offer
		if (pc.signalingState !== "have-remote-offer") return

		try {
			const answer = await pc.createAnswer()
			await pc.setLocalDescription(answer)
			const dto: WebRtcAnswerDto = {
				callId: state.callId,
				toUserId: state.peerUserId,
				sdp: answer.sdp || "",
				type: CallTypeEnum.ANSWER,
			}
			socket.emit("webrtcAnswer", dto)
			answeredRef.current = true
		} catch {}
	}, [socket, state.callId, state.peerUserId])

	const acceptIncomingCall = useCallback(async () => {
		if (!socket || !state.callId || !state.peerUserId) return

		socket.emit("respondToCall", {
			callId: state.callId,
			action: CallActionEnum.ACCEPT,
		})

		let pc = peerConnectionRef.current
		if (!pc) pc = createPeerConnection()
		acceptedRef.current = true
		const local = await getLocalStream(state.isVideoCall)
		attachLocalTracks(pc, local)

		// Attempt to answer now if we already have a remote offer
		await maybeCreateAndSendAnswer()

		// Apply queued ICE
		while (pendingRemoteIceRef.current.length) {
			const candidate = pendingRemoteIceRef.current.shift()!
			try {
				await pc.addIceCandidate(candidate)
			} catch {}
		}
	}, [
		socket,
		state.callId,
		state.isVideoCall,
		state.peerUserId,
		createPeerConnection,
		getLocalStream,
		maybeCreateAndSendAnswer,
	])

	const rejectIncomingCall = useCallback(() => {
		if (!socket || !state.callId) return
		socket.emit("respondToCall", {
			callId: state.callId,
			action: CallActionEnum.REJECT,
		})
		cleanup()
		setState(prev => ({
			...prev,
			phase: CallPhaseEnum.IDLE,
			callId: null,
			isVideoCall: false,
			isRemoteVideoOn: false,
			peerUserId: null,
			localStream: null,
			remoteStream: null,
		}))
	}, [socket, state.callId, cleanup])

	const endCall = useCallback(() => {
		if (socket && state.callId) {
			socket.emit("endCall", { callId: state.callId })
		}
		cleanup()
		setState(prev => ({ ...prev, phase: CallPhaseEnum.ENDED }))
		setTimeout(() => {
			setState(prev => ({
				...prev,
				phase: CallPhaseEnum.IDLE,
				callId: null,
				isVideoCall: false,
				isRemoteVideoOn: false,
				peerUserId: null,
				localStream: null,
				remoteStream: null,
			}))
		}, 300)
	}, [socket, state.callId, cleanup])

	const toggleMute = useCallback(() => {
		state.localStream?.getAudioTracks().forEach(t => (t.enabled = !t.enabled))
		// trigger re-render
		setState(prev => ({ ...prev }))
	}, [state.localStream])

	const toggleCamera = useCallback(() => {
		state.localStream?.getVideoTracks().forEach(t => (t.enabled = !t.enabled))
		setState(prev => ({ ...prev }))
	}, [state.localStream])

	// (moved cleanup earlier)

	// Socket signaling handlers
	useEffect(() => {
		if (!socket) return

		const handleIncomingCall = (notification: {
			callId: string
			callerId: string
			isVideoCall: boolean
		}) => {
			setState(prev => ({
				...prev,
				phase: CallPhaseEnum.INCOMING,
				callId: notification.callId,
				peerUserId: notification.callerId,
				isVideoCall: notification.isVideoCall,
			}))
		}

		const handleCallResponse = (response: {
			callId: string
			status: CallStatusEnum | "rejected"
		}) => {
			if (response.status === "rejected") {
				cleanup()
				setState(prev => ({
					...prev,
					phase: CallPhaseEnum.IDLE,
					callId: null,
					localStream: null,
					remoteStream: null,
					isRemoteVideoOn: false,
					peerUserId: null,
					isVideoCall: false,
				}))
			} else if (response.status === CallStatusEnum.ACTIVE) {
				// Callee accepted; caller waits for answer
				setState(prev => ({ ...prev, phase: CallPhaseEnum.CONNECTING }))
			}
		}

		const handleCallEnded = () => {
			cleanup()
			setState(prev => ({ ...prev, phase: CallPhaseEnum.ENDED }))
			setTimeout(() => {
				setState(prev => ({
					...prev,
					phase: CallPhaseEnum.IDLE,
					callId: null,
					isVideoCall: false,
					isRemoteVideoOn: false,
					peerUserId: null,
					localStream: null,
					remoteStream: null,
				}))
			}, 300)
		}

		const handleOffer = async (payload: {
			callId: string
			fromUserId: string
			sdp: string
		}) => {
			// Callee receives offer
			setState(prev => ({
				...prev,
				callId: payload.callId,
				peerUserId: payload.fromUserId,
			}))
			let pc = peerConnectionRef.current
			if (!pc) pc = createPeerConnection()
			await pc.setRemoteDescription({ type: "offer", sdp: payload.sdp })

			// Try to create/send answer only if accepted and not answered yet
			await maybeCreateAndSendAnswer()
		}

		const handleAnswer = async (payload: {
			callId: string
			fromUserId: string
			sdp: string
		}) => {
			// Caller receives answer
			const pc = peerConnectionRef.current
			if (!pc) return
			await pc.setRemoteDescription({ type: "answer", sdp: payload.sdp })
		}

		const handleIce = async (payload: {
			callId: string
			fromUserId: string
			candidate: RTCIceCandidateInit
		}) => {
			const pc = peerConnectionRef.current
			if (pc && pc.remoteDescription) {
				try {
					await pc.addIceCandidate(payload.candidate)
				} catch {}
			} else {
				pendingRemoteIceRef.current.push(payload.candidate)
			}
		}

		socket.on("incomingCall", handleIncomingCall)
		socket.on("callResponse", handleCallResponse)
		socket.on("callEnded", handleCallEnded)
		socket.on("webrtcOffer", handleOffer)
		socket.on("webrtcAnswer", handleAnswer)
		socket.on("webrtcIceCandidate", handleIce)

		return () => {
			socket.off("incomingCall", handleIncomingCall)
			socket.off("callResponse", handleCallResponse)
			socket.off("callEnded", handleCallEnded)
			socket.off("webrtcOffer", handleOffer)
			socket.off("webrtcAnswer", handleAnswer)
			socket.off("webrtcIceCandidate", handleIce)
		}
	}, [
		cleanup,
		createPeerConnection,
		maybeCreateAndSendAnswer,
		socket,
		state.localStream,
	])

	const api: UseWebRTCCallApi = useMemo(
		() => ({
			startCall,
			acceptIncomingCall,
			rejectIncomingCall,
			endCall,
			toggleMute,
			toggleCamera,
		}),
		[
			startCall,
			acceptIncomingCall,
			rejectIncomingCall,
			endCall,
			toggleMute,
			toggleCamera,
		]
	)

	return [state, api]
}
