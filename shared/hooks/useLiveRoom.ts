"use client"

import { toast } from "@/hooks/use-toast"
import { ChatMemberType, ChatType } from "@/prisma/models"
import {
	ApproveSpeakerDto,
	GetLiveRoomStateDto,
	JoinLiveDto,
	LeaveLiveDto,
	LiveCallTypeEnum,
	LiveRoomState,
	LiveWebRtcAnswerDto,
	LiveWebRtcIceCandidateDto,
	LiveWebRtcOfferDto,
	RaiseHandDto,
	RevokeSpeakerDto,
	StartLiveDto,
	StopLiveDto,
	ToggleMuteDto,
} from "@/shared/lib/services/live/live.types"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LiveParticipantType } from "../lib/services/call/call.types"
import { useUser } from "./useUser"

type PeerId = string

export type LivePhase = "idle" | "connecting" | "live" | "ended"

export interface UseLiveRoomState {
	chatId: string | null
	phase: LivePhase
	room: LiveRoomState | null
	localStream: MediaStream | null
	// Map peerId -> MediaStream
	remoteStreams: Map<PeerId, MediaStream>
	// mute state of self
	isSelfMuted: boolean
	// camera state of self
	isSelfVideoOff?: boolean
	// Live audio track state per peer for real-time role/mic updates
	peerAudio: Map<PeerId, { hasAudioTrack: boolean; isTrackMuted: boolean }>
	// whether we are currently sharing the screen
	isScreenSharing?: boolean
	// whether anyone (self or any remote) is sharing the screen
	isAnyScreenSharing?: boolean
}

export interface UseLiveRoomApi {
	startLive: (chatId: string) => void
	stopLive: (chatId: string) => void
	joinLive: (chatId: string) => void
	leaveLive: (chatId: string) => void
	raiseHand: (chatId: string) => void
	approveSpeaker: (chatId: string, userId: string) => void
	revokeSpeaker: (chatId: string, userId: string) => void
	toggleMuteUser: (chatId: string, userId: string, isMuted: boolean) => void
	toggleSelfMute: () => void
	toggleSelfVideo: () => Promise<void>
	toggleScreenShare: () => Promise<void>
}

export type IUseLiveRoom = {
	chat?: ChatType
}

const iceServers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }]

// Multi-peer map: peerId -> RTCPeerConnection
type PeerConnections = Map<PeerId, RTCPeerConnection>

export const useLiveRoom = ({
	chat,
}: IUseLiveRoom): [UseLiveRoomState, UseLiveRoomApi, LiveParticipantType[]] => {
	const { socket } = useSocket()
	const { user } = useUser()
	const [state, setState] = useState<UseLiveRoomState>({
		chatId: null,
		phase: "idle",
		room: null,
		localStream: null,
		remoteStreams: new Map(),
		isSelfMuted: true,
		isSelfVideoOff: true,
		peerAudio: new Map(),
		isScreenSharing: false,
	})

	const pcMapRef = useRef<PeerConnections>(new Map())
	const pendingIceRef = useRef<Map<PeerId, RTCIceCandidateInit[]>>(new Map())
	// Cleanup handlers for remote video tracks per peer to avoid leaks
	const videoTrackCleanupRef = useRef<Map<PeerId, () => void>>(new Map())
	// Ensure we notify server about initial self mute state only once per session/chat
	const selfMuteSyncedRef = useRef<string | null>(null)
	// keep references to switch between camera and screen tracks seamlessly
	const cameraVideoTrackRef = useRef<MediaStreamTrack | null>(null)
	const screenVideoTrackRef = useRef<MediaStreamTrack | null>(null)
	// When switching between camera and screen tracks, some browsers require ICE restart
	// to propagate new SSRC/codec params. We toggle this flag to request restart on next renegotiation.
	const needsIceRestartRef = useRef<boolean>(false)
	// Track last time we received a live state over socket to avoid unnecessary polling
	const lastLiveUpdateAtRef = useRef<number>(0)

	// Avoid unnecessary re-renders on polling by comparing snapshots
	const arraysEqualAsSets = useCallback(
		(a: string[] = [], b: string[] = []) => {
			if (a === b) return true
			if (a.length !== b.length) return false
			const setA = new Set(a)
			for (const v of b) if (!setA.has(v)) return false
			return true
		},
		[]
	)

	const isLiveRoomEqual = useCallback(
		(a?: LiveRoomState | null, b?: LiveRoomState | null) => {
			if (a === b) return true
			if (!a || !b) return false
			return (
				a.chatId === b.chatId &&
				a.isLive === b.isLive &&
				a.hostId === b.hostId &&
				a.startedAt === b.startedAt &&
				arraysEqualAsSets(a.speakers, b.speakers) &&
				arraysEqualAsSets(a.listeners, b.listeners) &&
				arraysEqualAsSets(a.muted, b.muted)
			)
		},
		[arraysEqualAsSets]
	)

	const cleanupPeer = useCallback((peerId: string) => {
		const pc = pcMapRef.current.get(peerId)
		if (pc) {
			try {
				pc.getSenders().forEach(s => s.track?.stop())
			} catch {}
			pc.close()
			pcMapRef.current.delete(peerId)
		}
		// cleanup remote video track listeners if any
		try {
			videoTrackCleanupRef.current.get(peerId)?.()
		} catch {}
		videoTrackCleanupRef.current.delete(peerId)
		setState(prev => {
			const nextStreams = new Map(prev.remoteStreams)
			nextStreams.delete(peerId)
			const nextAudio = new Map(prev.peerAudio)
			nextAudio.delete(peerId)
			return { ...prev, remoteStreams: nextStreams, peerAudio: nextAudio }
		})
	}, [])

	const cleanupAllPeers = useCallback(() => {
		Array.from(pcMapRef.current.keys()).forEach(cleanupPeer)
	}, [cleanupPeer])

	const getLocalStream = useCallback(async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices()
			const hasMic = devices.some(d => d.kind === "audioinput")
			if (!hasMic) {
				toast({ description: "Микрофон не найден", duration: 3000 })
			}
			// Start with audio only; create an empty stream and optionally add video later
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: hasMic
					? { echoCancellation: true, noiseSuppression: true }
					: false,
				video: false,
			})
			setState(prev => {
				// Enforce initial mute state on tracks
				try {
					stream.getAudioTracks().forEach(t => (t.enabled = !prev.isSelfMuted))
				} catch {}
				return { ...prev, localStream: stream }
			})
			return stream
		} catch (err) {
			toast({ description: "Нет доступа к микрофону", duration: 3000 })
			throw err
		}
	}, [])

	const ensurePcForPeer = useCallback(
		(peerId: string) => {
			let pc = pcMapRef.current.get(peerId)
			if (pc) return pc
			pc = new RTCPeerConnection({ iceServers })

			pc.onicecandidate = evt => {
				if (!evt.candidate || !socket || !state.chatId) return
				const dto: LiveWebRtcIceCandidateDto = {
					chatId: state.chatId,
					toUserId: peerId,
					candidate: evt.candidate.toJSON(),
				}
				socket.emit("liveWebrtcIceCandidate", dto)
			}

			pc.ontrack = ev => {
				const [remote] = ev.streams
				setState(prev => {
					const nextStreams = new Map(prev.remoteStreams)
					nextStreams.set(peerId, remote)
					return { ...prev, remoteStreams: nextStreams }
				})

				// Track remote video state transitions to force re-render on end/mute
				if (ev.track && ev.track.kind === "video") {
					// cleanup previous listeners for this peer
					try {
						videoTrackCleanupRef.current.get(peerId)?.()
					} catch {}
					videoTrackCleanupRef.current.delete(peerId)

					const handleChange = () =>
						setState(prev => ({
							...prev,
							// Clone map to trigger re-computation where track predicates are used
							remoteStreams: new Map(prev.remoteStreams),
						}))

					ev.track.addEventListener("mute", handleChange)
					ev.track.addEventListener("unmute", handleChange)
					ev.track.addEventListener("ended", handleChange)

					videoTrackCleanupRef.current.set(peerId, () => {
						try {
							ev.track.removeEventListener("mute", handleChange)
							ev.track.removeEventListener("unmute", handleChange)
							ev.track.removeEventListener("ended", handleChange)
						} catch {}
					})
				}

				// Track live audio state for real-time role/mic updates
				if (ev.track && ev.track.kind === "audio") {
					const audioTrack = ev.track
					const updatePeerAudio = (muted: boolean) => {
						setState(prev => {
							const next = new Map(prev.peerAudio)
							next.set(peerId, { hasAudioTrack: true, isTrackMuted: muted })
							return { ...prev, peerAudio: next }
						})
					}
					updatePeerAudio(audioTrack.muted)
					audioTrack.onmute = () => updatePeerAudio(true)
					audioTrack.onunmute = () => updatePeerAudio(false)
				}
			}

			pc.onconnectionstatechange = () => {
				const st = pc!.connectionState
				// Don't treat "disconnected" as fatal; it can be transient
				if (st === "failed" || st === "closed") {
					cleanupPeer(peerId)
				}
			}

			pcMapRef.current.set(peerId, pc)
			return pc
		},
		[cleanupPeer, socket, state.chatId]
	)

	const attachLocalTracks = useCallback(
		async (pc: RTCPeerConnection) => {
			const stream = state.localStream || (await getLocalStream())
			const senders = pc.getSenders()
			stream.getTracks().forEach(track => {
				// If this exact track is already sent, do nothing
				const sameIdSender = senders.find(
					s => s.track && s.track.id === track.id
				)
				if (sameIdSender) return
				// If a sender for the same kind exists, replace it to avoid duplicates
				const sameKindSender = senders.find(
					s => s.track && s.track.kind === track.kind
				)
				if (sameKindSender) {
					sameKindSender.replaceTrack(track)
				} else {
					pc.addTrack(track, stream)
				}
			})
		},
		[getLocalStream, state.localStream]
	)

	// Public API
	const startLive = useCallback(
		(chatId: string) => {
			if (!socket) return
			const dto: StartLiveDto = { chatId }
			setState(prev => ({ ...prev, chatId }))
			// reset sync so we send initial mute state for this session
			selfMuteSyncedRef.current = null
			// Try ack first
			socket.emit("startLive", dto, (room?: LiveRoomState) => {
				if (room) {
					setState(prev => ({
						...prev,
						room,
						phase: room.isLive ? "live" : prev.phase,
					}))
					// ensure we're joined as publisher if we are host
					socket.emit("joinLive", { chatId } as JoinLiveDto)
				} else {
					// fallback: ask for state explicitly
					socket.emit(
						"getLiveRoomState",
						{ chatId } as GetLiveRoomStateDto,
						(resp?: LiveRoomState) => {
							if (resp)
								setState(prev => ({
									...prev,
									room: resp,
									phase: resp.isLive ? "live" : prev.phase,
								}))
						}
					)
				}
			})
			// Also explicitly request state in case ack is not used on backend
			socket.emit(
				"getLiveRoomState",
				{ chatId } as GetLiveRoomStateDto,
				(resp?: LiveRoomState) => {
					if (resp)
						setState(prev => ({
							...prev,
							room: resp,
							phase: resp.isLive ? "live" : prev.phase,
						}))
				}
			)
		},
		[socket]
	)

	const stopLive = useCallback(
		(chatId: string) => {
			if (!socket) return
			const dto: StopLiveDto = { chatId }
			socket.emit("stopLive", dto, (room?: LiveRoomState) => {
				setState(prev => ({
					...prev,
					room: room ?? prev.room,
					isSelfVideoOff: true,
					isScreenSharing: false,
				}))
			})
		},
		[socket]
	)

	const joinLive = useCallback(
		(chatId: string) => {
			if (!socket) return
			const dto: JoinLiveDto = { chatId }
			setState(prev => ({ ...prev, chatId, phase: "connecting" }))
			// reset sync so we send initial mute state for this session
			selfMuteSyncedRef.current = null
			socket.emit("joinLive", dto, (room?: LiveRoomState) => {
				if (room) {
					setState(prev => ({
						...prev,
						room,
						phase: room.isLive ? "live" : prev.phase,
					}))
				}
			})
		},
		[socket]
	)

	const leaveLive = useCallback(
		(chatId: string) => {
			if (!socket) return
			const dto: LeaveLiveDto = { chatId }
			socket.emit("leaveLive", dto, () => {
				cleanupAllPeers()
				state.localStream?.getTracks().forEach(t => t.stop())
				setState(prev => ({
					...prev,
					phase: "idle",
					// keep last known room snapshot; polling/events will refresh it
					chatId: null,
					localStream: null,
					remoteStreams: new Map(),
					isSelfVideoOff: true,
					isScreenSharing: false,
				}))
			})
		},
		[cleanupAllPeers, socket, state.localStream]
	)

	const raiseHand = useCallback(
		(chatId: string) => {
			if (!socket) return
			const dto: RaiseHandDto = { chatId }
			socket.emit("raiseHand", dto)
		},
		[socket]
	)

	const approveSpeaker = useCallback(
		(chatId: string, userId: string) => {
			if (!socket) return
			const dto: ApproveSpeakerDto = { chatId, userId }
			// Optimistic UI update
			setState(prev => {
				const room = prev.room
				if (!room || room.chatId !== chatId) return prev
				const nextRoom: LiveRoomState = {
					...room,
					listeners: room.listeners.filter(id => id !== userId),
					speakers: room.speakers.includes(userId)
						? room.speakers
						: [...room.speakers, userId],
					muted: room.muted.filter(id => id !== userId),
				}
				return { ...prev, room: nextRoom }
			})
			socket.emit("approveSpeaker", dto)
		},
		[socket]
	)

	const revokeSpeaker = useCallback(
		(chatId: string, userId: string) => {
			if (!socket) return
			const dto: RevokeSpeakerDto = { chatId, userId }
			// Optimistic UI update
			setState(prev => {
				const room = prev.room
				if (!room || room.chatId !== chatId) return prev
				const nextListeners = room.listeners.includes(userId)
					? room.listeners
					: [...room.listeners, userId]
				const nextRoom: LiveRoomState = {
					...room,
					speakers: room.speakers.filter(id => id !== userId),
					listeners: nextListeners,
					muted: room.muted.filter(id => id !== userId),
				}
				return { ...prev, room: nextRoom }
			})
			socket.emit("revokeSpeaker", dto)
		},
		[socket]
	)

	const toggleMuteUser = useCallback(
		(chatId: string, userId: string, isMuted: boolean) => {
			if (!socket) return
			const dto: ToggleMuteDto = { chatId, userId, isMuted }
			// Optimistic UI update
			setState(prev => {
				const room = prev.room
				if (!room || room.chatId !== chatId) return prev
				const nextMuted = isMuted
					? room.muted.includes(userId)
						? room.muted
						: [...room.muted, userId]
					: room.muted.filter(id => id !== userId)
				return { ...prev, room: { ...room, muted: nextMuted } }
			})
			socket.emit("toggleMute", dto)
		},
		[socket]
	)

	const toggleSelfMute = useCallback(() => {
		setState(prev => {
			const nextMuted = !prev.isSelfMuted
			prev.localStream?.getAudioTracks().forEach(t => (t.enabled = !nextMuted))
			// Notify server so room.muted updates and others see mic state
			try {
				if (socket && prev.chatId && user?.id) {
					const dto: ToggleMuteDto = {
						chatId: prev.chatId,
						userId: user.id,
						isMuted: nextMuted,
					}
					socket.emit("toggleMute", dto)
				}
			} catch {}
			return { ...prev, isSelfMuted: nextMuted }
		})
	}, [socket, user?.id])

	const ensureLocalVideoTrack = useCallback(async () => {
		let streamLocal = state.localStream
		if (!streamLocal) streamLocal = await getLocalStream()
		if (!streamLocal) return null
		const hasVideo = streamLocal.getVideoTracks().length > 0
		if (hasVideo) return streamLocal.getVideoTracks()[0]
		try {
			const cam = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			})
			const [videoTrack] = cam.getVideoTracks()
			if (videoTrack) {
				streamLocal.addTrack(videoTrack)
				// replace/add on all peer connections
				pcMapRef.current.forEach(pc => {
					const sender = pc.getSenders().find(s => s.track?.kind === "video")
					if (sender) sender.replaceTrack(videoTrack)
					else pc.addTrack(videoTrack, streamLocal as MediaStream)
				})
				setState(prev => ({ ...prev, localStream: streamLocal! }))
				return videoTrack
			}
		} catch {}
		return null
	}, [getLocalStream, state.localStream])

	const renegotiateAllPeers = useCallback(async () => {
		if (!socket || !state.chatId) return
		for (const [peerUserId, pcExisting] of pcMapRef.current.entries()) {
			const pc = pcExisting || ensurePcForPeer(peerUserId)
			await attachLocalTracks(pc)
			const needIceRestart = !!needsIceRestartRef.current
			try {
				const pcWithRestart = pc as unknown as { restartIce?: () => void }
				if (needIceRestart && typeof pcWithRestart.restartIce === "function") {
					pcWithRestart.restartIce()
				}
			} catch {}
			const offer = await pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true,
				iceRestart: needIceRestart,
			})
			await pc.setLocalDescription(offer)
			const dto: LiveWebRtcOfferDto = {
				chatId: state.chatId,
				toUserId: peerUserId,
				sdp: offer.sdp || "",
				type: LiveCallTypeEnum.OFFER,
			}
			socket.emit("liveWebrtcOffer", dto)
			// apply any queued ICE
			const pending = pendingIceRef.current.get(peerUserId) || []
			for (const cand of pending) {
				try {
					await pc.addIceCandidate(cand)
				} catch {}
			}
			pendingIceRef.current.delete(peerUserId)
		}
		needsIceRestartRef.current = false
	}, [attachLocalTracks, ensurePcForPeer, socket, state.chatId])

	// Helper: replace video track on all peers and adjust transceiver direction
	const replaceVideoTrackForAllPeers = useCallback(
		(track: MediaStreamTrack | null, streamForTrack?: MediaStream | null) => {
			pcMapRef.current.forEach(pc => {
				const sender = pc.getSenders().find(s => s.track?.kind === "video")
				if (sender) {
					try {
						void sender.replaceTrack(track)
					} catch {}
					// Ensure transceiver direction allows sending when we have a track
					try {
						const transceiver = pc
							.getTransceivers()
							.find(t => t.sender === sender)
						if (transceiver) {
							transceiver.direction = track ? "sendrecv" : "recvonly"
						}
					} catch {}
				} else if (track && streamForTrack) {
					pc.addTrack(track, streamForTrack)
				}
			})
		},
		[]
	)

	const toggleSelfVideo = useCallback(async () => {
		// Ensure we have a base local stream
		let streamLocal = state.localStream
		if (!streamLocal) streamLocal = await getLocalStream()
		const currentTrack = streamLocal?.getVideoTracks()?.[0] || null
		// If there is no current video track, turn camera ON
		if (!currentTrack) {
			const newTrack = await ensureLocalVideoTrack()
			if (newTrack) {
				newTrack.enabled = true
				setState(prev => ({ ...prev, isSelfVideoOff: false }))
				// Make sure peers fully apply the new video by renegotiation
				needsIceRestartRef.current = true
				await renegotiateAllPeers()
			}
			return
		}
		// If we have a track (camera is ON) – turn camera OFF by removing/stopping it
		try {
			currentTrack.stop()
		} catch {}
		try {
			streamLocal!.removeTrack(currentTrack)
		} catch {}
		// Replace on all peers with null and update transceivers to recvonly
		replaceVideoTrackForAllPeers(null)
		setState(prev => ({
			...prev,
			localStream: streamLocal!,
			isSelfVideoOff: true,
		}))
		// Force ICE restart to ensure remote peers clear black frames
		needsIceRestartRef.current = true
		await renegotiateAllPeers()
	}, [
		ensureLocalVideoTrack,
		getLocalStream,
		renegotiateAllPeers,
		replaceVideoTrackForAllPeers,
		state.localStream,
	])

	const stopScreenShareInternal = useCallback(async () => {
		const screenTrack = screenVideoTrackRef.current
		if (screenTrack) {
			try {
				screenTrack.stop()
			} catch {}
			screenVideoTrackRef.current = null
		}
		const stream = state.localStream
		const cameraTrack = cameraVideoTrackRef.current
		if (!stream) {
			setState(prev => ({ ...prev, isScreenSharing: false }))
			return
		}
		// Remove any current video tracks from local stream
		stream.getVideoTracks().forEach(t => stream!.removeTrack(t))
		if (cameraTrack) {
			stream.addTrack(cameraTrack)
			replaceVideoTrackForAllPeers(cameraTrack, stream)
			setState(prev => ({
				...prev,
				localStream: stream!,
				isSelfVideoOff: false,
				isScreenSharing: false,
			}))
		} else {
			// No camera to restore: remove video from peers
			replaceVideoTrackForAllPeers(null)
			setState(prev => ({
				...prev,
				localStream: stream!,
				isSelfVideoOff: true,
				isScreenSharing: false,
			}))
		}
		// Force ICE restart to reliably resume video for remote peers
		needsIceRestartRef.current = true
		await renegotiateAllPeers()
	}, [renegotiateAllPeers, replaceVideoTrackForAllPeers, state.localStream])

	const toggleScreenShare = useCallback(async () => {
		if (!state.isScreenSharing) {
			try {
				// Capture screen
				// Typesafe access to getDisplayMedia if available
				const mediaDevices = navigator.mediaDevices as MediaDevices & {
					getDisplayMedia?: (
						constraints?: MediaStreamConstraints
					) => Promise<MediaStream>
				}
				const displayStream = await mediaDevices.getDisplayMedia?.({
					video: {
						frameRate: { ideal: 30, max: 30 },
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
					audio: false,
				})
				if (!displayStream) return
				const screenTrack: MediaStreamTrack | undefined =
					displayStream.getVideoTracks?.()?.[0]
				if (!screenTrack) return

				const baseStream = state.localStream || (await getLocalStream())
				if (!baseStream) return
				// Save current camera track if present
				const currentCam = baseStream.getVideoTracks()[0] || null
				if (currentCam) cameraVideoTrackRef.current = currentCam

				// Replace video track in local stream
				baseStream.getVideoTracks().forEach(t => baseStream!.removeTrack(t))
				baseStream.addTrack(screenTrack)

				// Replace on all peers
				replaceVideoTrackForAllPeers(screenTrack, baseStream)

				// Auto-stop handler from browser UI (when user stops sharing)
				screenTrack.onended = () => {
					stopScreenShareInternal()
				}

				screenVideoTrackRef.current = screenTrack
				setState(prev => ({
					...prev,
					localStream: baseStream!,
					isSelfVideoOff: false,
					isScreenSharing: true,
				}))
				// Force ICE restart so remote peers update their pipeline
				needsIceRestartRef.current = true
				await renegotiateAllPeers()
			} catch {
				// ignore
			}
			return
		}
		// If already sharing – stop and restore
		await stopScreenShareInternal()
	}, [
		getLocalStream,
		renegotiateAllPeers,
		state.isScreenSharing,
		state.localStream,
		stopScreenShareInternal,
		replaceVideoTrackForAllPeers,
	])

	// Socket listeners
	useEffect(() => {
		if (!socket) return

		const handleLiveState = (room: LiveRoomState) => {
			const targetChatId = state.chatId || chat?.id
			if (!targetChatId || room.chatId !== targetChatId) return
			lastLiveUpdateAtRef.current = Date.now()
			setState(prev => ({
				...prev,
				room,
				phase: room.isLive ? "live" : prev.phase,
			}))
		}

		const handleOffer = async (payload: {
			chatId: string
			fromUserId: string
			sdp: string
			type: LiveCallTypeEnum
		}) => {
			if (!state.chatId || payload.chatId !== state.chatId) return
			const peerId = payload.fromUserId
			const pc = ensurePcForPeer(peerId)
			if (!pc) return
			await pc.setRemoteDescription({ type: "offer", sdp: payload.sdp })
			await attachLocalTracks(pc)
			const answer = await pc.createAnswer()
			await pc.setLocalDescription(answer)
			const dto: LiveWebRtcAnswerDto = {
				chatId: state.chatId,
				toUserId: peerId,
				sdp: answer.sdp || "",
				type: LiveCallTypeEnum.ANSWER,
			}
			socket.emit("liveWebrtcAnswer", dto)
			setState(prev => ({ ...prev, phase: "live" }))
		}

		const handleAnswer = async (payload: {
			chatId: string
			fromUserId: string
			sdp: string
			type: LiveCallTypeEnum
		}) => {
			if (!state.chatId || payload.chatId !== state.chatId) return
			const pc = pcMapRef.current.get(payload.fromUserId)
			if (!pc) return
			await pc.setRemoteDescription({ type: "answer", sdp: payload.sdp })
			setState(prev => ({ ...prev, phase: "live" }))
		}

		const handleIce = async (payload: {
			chatId: string
			fromUserId: string
			candidate: RTCIceCandidateInit
		}) => {
			if (!state.chatId || payload.chatId !== state.chatId) return
			const peerId = payload.fromUserId
			const pc = pcMapRef.current.get(peerId)
			if (pc && pc.remoteDescription) {
				try {
					await pc.addIceCandidate(payload.candidate)
				} catch {}
			} else {
				const list = pendingIceRef.current.get(peerId) || []
				list.push(payload.candidate)
				pendingIceRef.current.set(peerId, list)
			}
		}

		socket.on("liveRoomState", handleLiveState)
		// Support backend event name 'liveState'
		socket.on("liveState", handleLiveState)
		socket.on("liveWebrtcOffer", handleOffer)
		socket.on("liveWebrtcAnswer", handleAnswer)
		socket.on("liveWebrtcIceCandidate", handleIce)

		return () => {
			socket.off("liveRoomState", handleLiveState)
			socket.off("liveState", handleLiveState)
			socket.off("liveWebrtcOffer", handleOffer)
			socket.off("liveWebrtcAnswer", handleAnswer)
			socket.off("liveWebrtcIceCandidate", handleIce)
		}
	}, [attachLocalTracks, ensurePcForPeer, socket, state.chatId, chat?.id])

	// Expose helper to create offer to a peer (e.g., when we learn peers list)
	const createAndSendOfferToPeer = useCallback(
		async (peerUserId: string) => {
			if (!socket || !state.chatId) return
			const pc = ensurePcForPeer(peerUserId)
			await attachLocalTracks(pc)
			// After we attached tracks, ensure initial mute state is reflected and sent once
			if (selfMuteSyncedRef.current !== state.chatId && user?.id) {
				try {
					state.localStream
						?.getAudioTracks()
						.forEach(t => (t.enabled = !state.isSelfMuted))
					const dto: ToggleMuteDto = {
						chatId: state.chatId,
						userId: user.id,
						isMuted: state.isSelfMuted,
					}
					socket.emit("toggleMute", dto)
					selfMuteSyncedRef.current = state.chatId
				} catch {}
			}
			const offer = await pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true,
			})
			await pc.setLocalDescription(offer)
			const dto: LiveWebRtcOfferDto = {
				chatId: state.chatId,
				toUserId: peerUserId,
				sdp: offer.sdp || "",
				type: LiveCallTypeEnum.OFFER,
			}
			socket.emit("liveWebrtcOffer", dto)
			// apply any queued ICE
			const pending = pendingIceRef.current.get(peerUserId) || []
			for (const cand of pending) {
				try {
					await pc.addIceCandidate(cand)
				} catch {}
			}
			pendingIceRef.current.delete(peerUserId)
		},
		[
			attachLocalTracks,
			ensurePcForPeer,
			socket,
			state.chatId,
			state.isSelfMuted,
			state.localStream,
			user?.id,
		]
	)

	// When room state updates, initiate offers to speakers/host if we are speaker/host
	useEffect(() => {
		const room = state.room
		if (!room) return
		const myId = user?.id
		// Simple heuristic: connect to all speakers and host (excluding myself)
		const targets = new Set<string>([room.hostId || "", ...room.speakers])
		if (myId) targets.delete(myId)
		targets.forEach(peerId => {
			if (!peerId) return
			if (!pcMapRef.current.has(peerId)) {
				createAndSendOfferToPeer(peerId)
			}
		})
		// listeners receive audio only; they can connect to host/speakers by default via offers from speakers/host
	}, [state.room, createAndSendOfferToPeer, user?.id])

	// Looser pruning: only remove streams when room is not live anymore
	useEffect(() => {
		const room = state.room
		if (!room) return
		if (!room.isLive) {
			// end: cleanup everything
			Array.from(pcMapRef.current.keys()).forEach(cleanupPeer)
			setState(prev => ({ ...prev, remoteStreams: new Map() }))
		}
	}, [state.room, cleanupPeer])

	// One-time snapshot to seed state, then rely on socket events
	useEffect(() => {
		if (!socket) return
		const effectiveChatId = state.chatId || chat?.id
		if (!effectiveChatId) return
		socket.emit(
			"getLiveRoomState",
			{ chatId: effectiveChatId } as GetLiveRoomStateDto,
			(resp?: LiveRoomState) => {
				if (resp && resp.chatId === effectiveChatId) {
					setState(prev =>
						isLiveRoomEqual(prev.room, resp) ? prev : { ...prev, room: resp }
					)
				}
			}
		)
		// Join chat room to receive broadcast updates even when not actively in live
		socket.emit("joinChat", { chatId: effectiveChatId })
	}, [socket, state.chatId, chat?.id, isLiveRoomEqual])

	const memberMap = useMemo(() => {
		const map = new Map<string, { name?: string; imageUrl?: string }>()
		chat?.members.forEach((m: ChatMemberType) => {
			map.set(m.userId, {
				name: (m.user?.name ?? undefined) as string | undefined,
				imageUrl: (m.user?.imageUrl ?? undefined) as string | undefined,
			})
		})
		return map
	}, [chat])

	const participants = useMemo(() => {
		if (!state.room)
			return [] as Array<{
				userId: string
				name?: string
				imageUrl?: string
				role: "host" | "speaker" | "listener"
				micOn: boolean
			}>
		// Prefer server-provided participants if available
		if (state.room.participants && state.room.participants.length > 0) {
			return state.room.participants.map(p => {
				const peerAudio = state.peerAudio.get(p.userId)
				const isSelf = p.userId === (user?.id || "")
				const localAudioOn = isSelf
					? !!state.localStream?.getAudioTracks().some(t => t.enabled) &&
					  !state.isSelfMuted
					: false
				const micOn = isSelf
					? localAudioOn
					: p.isMuted
					? false
					: peerAudio !== undefined
					? peerAudio.hasAudioTrack && !peerAudio.isTrackMuted
					: false
				return {
					userId: p.userId,
					name: p.name,
					imageUrl: p.imageUrl,
					role: p.role.toLowerCase() as "host" | "speaker" | "listener",
					micOn,
				}
			})
		}
		// Fallback to local derivation
		const ids = Array.from(
			new Set([
				...(state.room.hostId ? [state.room.hostId] : []),
				...state.room.speakers,
				...state.room.listeners,
			])
		) as string[]
		return ids.map(userId => {
			const isSpeaker = state.room?.speakers.includes(userId)
			const muted = state.room?.muted.includes(userId)
			const peerAudio = state.peerAudio.get(userId)
			const isSelf = userId === (user?.id || "")
			const localAudioOn = isSelf
				? !!state.localStream?.getAudioTracks().some(t => t.enabled) &&
				  !state.isSelfMuted
				: false
			const role = isSpeaker ? "speaker" : "listener"
			const { name, imageUrl } = memberMap.get(userId) || {}
			const micOn = isSelf
				? localAudioOn
				: muted
				? false
				: peerAudio !== undefined
				? peerAudio.hasAudioTrack && !peerAudio.isTrackMuted
				: false
			return { userId, name, imageUrl, role, micOn }
		})
	}, [
		memberMap,
		state.room,
		state.isSelfMuted,
		state.localStream,
		state.peerAudio,
		user?.id,
	])

	const api: UseLiveRoomApi = useMemo(
		() => ({
			startLive,
			stopLive,
			joinLive,
			leaveLive,
			raiseHand,
			approveSpeaker,
			revokeSpeaker,
			toggleMuteUser,
			toggleSelfMute,
			toggleSelfVideo,
			toggleScreenShare,
		}),
		[
			approveSpeaker,
			joinLive,
			leaveLive,
			raiseHand,
			revokeSpeaker,
			startLive,
			stopLive,
			toggleMuteUser,
			toggleSelfMute,
			toggleSelfVideo,
			toggleScreenShare,
		]
	)

	// Derived: true if we are sharing OR any remote stream has a live video track
	const isAnyScreenSharing = useMemo(() => {
		if (state.isScreenSharing) return true
		for (const stream of state.remoteStreams.values()) {
			const tracks = stream.getVideoTracks ? stream.getVideoTracks() : []
			if (
				tracks.some(
					t => t.readyState === "live" && !t.muted && (t.enabled ?? true)
				)
			) {
				return true
			}
		}
		return false
	}, [state.isScreenSharing, state.remoteStreams])

	const stateWithDerived: UseLiveRoomState = useMemo(
		() => ({ ...state, isAnyScreenSharing }),
		[state, isAnyScreenSharing]
	)

	return [stateWithDerived, api, participants]
}
