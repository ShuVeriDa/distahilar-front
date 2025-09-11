"use client"

import { ChatMemberType, ChatType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import {
	UseWebRTCCallApi,
	UseWebRTCCallState,
} from "@/shared/hooks/useWebRTCCall"
import { CallPhaseEnum } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import Image from "next/image"
import { FC, useEffect, useMemo, useState } from "react"
import { FaVideo } from "react-icons/fa"
import { IoMdCall, IoMdClose } from "react-icons/io"
import { LuMic, LuMicOff, LuVideo, LuVideoOff } from "react-icons/lu"
import { MdCallEnd } from "react-icons/md"

type Props = {
	visible: boolean
	peerUserId: string | null
	chatId: string
	chat: ChatType | undefined
	callState: UseWebRTCCallState
	callApi: UseWebRTCCallApi
	endDialogCall: () => void
}

export const CallOverlay: FC<Props> = ({
	visible,
	peerUserId,
	chatId,
	chat,
	callApi,
	callState,
	endDialogCall,
}) => {
	const {
		localStream,
		remoteStream,
		isVideoCall: isVideo,
		phase,
		isRemoteVideoOn,
	} = callState

	const peerAvatarUrl =
		chat?.members.find((m: ChatMemberType) => m.userId === peerUserId)?.user
			.imageUrl ?? "/images/no-avatar.png"
	const peerName = chat?.members.find(
		(m: ChatMemberType) => m.userId === peerUserId
	)?.user.name

	const {
		acceptIncomingCall,
		rejectIncomingCall,
		endCall,
		toggleMute,
		toggleCamera,
	} = callApi

	const isMuted = (() => {
		const tracks = localStream?.getAudioTracks() || []
		if (!tracks.length) return false
		return tracks.every(t => !t.enabled)
	})()

	const isCamOff = (() => {
		if (!isVideo) return false
		const tracks = localStream?.getVideoTracks() || []
		if (!tracks.length) return false
		return tracks.every(t => !t.enabled)
	})()

	const [callSeconds, setCallSeconds] = useState(0)

	useEffect(() => {
		if (phase !== CallPhaseEnum.ACTIVE) {
			setCallSeconds(0)
			return
		}
		const id = setInterval(() => setCallSeconds(s => s + 1), 1000)
		return () => clearInterval(id)
	}, [phase])

	const formatDuration = (sec: number) => {
		const mm = Math.floor(sec / 60)
		const ss = sec % 60
		return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`
	}

	const statusText = useMemo(() => {
		if (phase === CallPhaseEnum.IDLE)
			return "Click on the Camera icon if you want to start a video call."
		if (phase === CallPhaseEnum.ACTIVE) return formatDuration(callSeconds)
		if (phase === CallPhaseEnum.CONNECTING) return "Connecting…"
		if (phase === CallPhaseEnum.CALLING) return "Calling…"
		if (phase === CallPhaseEnum.INCOMING) return "Incoming call"
		if (phase === CallPhaseEnum.ENDED) return "Ended"
		return ""
	}, [phase, callSeconds])

	const startDialogAudioCall = () => {
		if (!peerUserId) return
		callApi.startCall({ chatId, peerUserId, isVideoCall: false })
	}

	const startDialogVideoCall = () => {
		if (!peerUserId) return
		callApi.startCall({ chatId, peerUserId, isVideoCall: true })
	}

	if (!visible) return null

	console.log({ remoteStream, isRemoteVideoOn, isVideo, isCamOff })

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
			{/* <div className="relative w-full max-w-[860px] h-[70vh] max-h-[640px] rounded-2xl overflow-hidden bg-[#0B141A]"> */}
			<div
				className={cn(
					"flex flex-col justify-between w-full max-w-[720px] h-full max-h-[540px] rounded-lg overflow-hidden bg-[#1B1F23]"
					// isVideo && "justify-around"
				)}
			>
				<div
					className={cn(
						"w-full h-auto flex flex-col items-center justify-center pt-[14.5%] relative",
						!isCamOff && "pt-0 h-full"
					)}
				>
					<div className="flex flex-col items-center justify-center ">
						<Avatar
							src={peerAvatarUrl}
							name={peerName}
							size={isVideo && !isCamOff ? 100 : 160}
						/>
						<div
							className={cn(
								"max-w-[450px] flex flex-col justify-center items-center gap-1 mt-10 mb-[90px]",
								!isCamOff && "mb-5 mt-5"
							)}
						>
							<Typography
								tag="p"
								className="text-white text-[17px] font-medium"
							>
								{peerName}
							</Typography>
							<Typography
								tag="span"
								className="text-[#AAABAC] text-[15px] font-normal text-center leading-5"
							>
								{statusText}
							</Typography>
						</div>
					</div>

					{/* Remote video or audio backdrop */}
					{isVideo && remoteStream && isRemoteVideoOn && (
						<div className="w-[60%] aspect-video rounded-lg overflow-hidden border border-white/20 shadow-lg ">
							<video
								ref={node => {
									if (node && remoteStream) {
										;(node as HTMLVideoElement).srcObject = remoteStream
										node.muted = false
										node.autoplay = true
										node.playsInline = true
									}
								}}
								className="w-full h-full object-cover"
							/>
							<div className="bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
						</div>
					)}

					{/* Remote audio element to play sound during audio-only calls */}
					{remoteStream ? (
						<audio
							ref={node => {
								if (node && remoteStream) {
									;(node as HTMLAudioElement).srcObject = remoteStream
									node.autoplay = true
									node.muted = false
								}
							}}
							className="hidden"
						/>
					) : null}

					{/* Local PiP */}
					{isVideo && localStream && !isCamOff ? (
						<div
							className={cn(
								"w-[60%] aspect-video rounded-lg overflow-hidden border border-white/20 shadow-lg bg-yellow-200",
								remoteStream &&
									isRemoteVideoOn &&
									"w-[20%] absolute bottom-5 right-5 "
							)}
						>
							<video
								ref={node => {
									if (node && localStream) {
										;(node as HTMLVideoElement).srcObject = localStream
										node.muted = true
										node.autoplay = true
										node.playsInline = true
									}
								}}
								className="w-full h-full object-cover"
							/>
						</div>
					) : null}
				</div>

				{/* Controls */}
				<div className="flex items-center justify-center gap-5 pb-2">
					{phase === CallPhaseEnum.IDLE ? (
						<div className="flex items-center gap-6">
							<Button
								variant="clean"
								onClick={startDialogVideoCall}
								aria-label="Video call"
								className="flex flex-col gap-1.5"
							>
								<div className="flex items-center justify-center bg-[#66C95B] hover:bg-[#56b14a] p-3 rounded-full">
									<FaVideo size={22} className="text-white" />
								</div>
								<span className="text-white text-[13px]">Start Video</span>
							</Button>
							<Button
								variant="clean"
								onClick={endDialogCall}
								aria-label="Cancel call"
								className="flex flex-col gap-1.5"
							>
								<div className="flex items-center justify-center bg-[#E8E8E9] hover:bg-[#d1d1d1] p-3 rounded-full">
									<IoMdClose size={22} className="text-[#222222]" />
								</div>

								<span className="text-white text-[13px]">Cancel</span>
							</Button>
							<Button
								variant="clean"
								onClick={startDialogAudioCall}
								aria-label="Audio call"
								className="flex flex-col gap-1.5"
							>
								<div className="flex items-center justify-center bg-[#66C95B] hover:bg-[#56b14a] p-3 rounded-full">
									<IoMdCall size={22} className="text-white" />
								</div>
								<span className="text-white text-[13px]">Start Call</span>
							</Button>
						</div>
					) : phase === CallPhaseEnum.INCOMING ? (
						<div className="flex items-center gap-6">
							<Button
								variant="clean"
								aria-label="Reject"
								className="flex flex-col gap-1.5"
								onClick={rejectIncomingCall}
							>
								<div className="flex items-center justify-center bg-[#D75A5A] hover:bg-[#c44a4a] p-3 rounded-full">
									<MdCallEnd size={22} className="text-white" />
								</div>
								<span className="text-white text-[13px]">Reject</span>
							</Button>

							<Button
								variant="clean"
								onClick={acceptIncomingCall}
								aria-label="Accept"
								className="flex flex-col gap-1.5"
							>
								<div className="flex items-center justify-center bg-[#66C95B] hover:bg-[#56b14a] p-3 rounded-full">
									<IoMdCall size={22} className="text-white" />
								</div>
								<span className="text-white text-[13px]">Accept</span>
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-6">
							<Button
								variant="clean"
								aria-label={isMuted ? "Unmute" : "Mute"}
								className="flex flex-col gap-1.5"
								onClick={toggleMute}
							>
								<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
									{isMuted ? <LuMicOff size={20} /> : <LuMic size={20} />}
								</div>
								<span className="text-white text-[13px]">Mute</span>
							</Button>
							{isVideo ? (
								<Button
									variant="clean"
									aria-label={!isCamOff ? "Turn camera on" : "Turn camera off"}
									className="flex flex-col gap-1.5"
									onClick={toggleCamera}
								>
									<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
										{!isCamOff ? (
											<LuVideoOff size={20} />
										) : (
											<LuVideo size={20} />
										)}
									</div>
									<span className="text-white text-[13px]">Camera</span>
								</Button>
							) : null}
							<Button
								variant="clean"
								aria-label="End call"
								className="flex flex-col gap-1.5"
								onClick={endCall}
							>
								<div className="flex items-center justify-center bg-red-500 hover:bg-red-600 p-3 rounded-full">
									<MdCallEnd size={22} className="text-white" />
								</div>
								<span className="text-white text-[13px]">End call</span>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

const Avatar: FC<{ src?: string; name?: string; size?: number }> = ({
	src,
	name,
	size = 40,
}) => {
	const initials = useMemo(() => {
		const text = name?.trim() || "?"
		const parts = text.split(" ").filter(Boolean)
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
		return (parts[0][0] + parts[1][0]).toUpperCase()
	}, [name])
	// const style = { width: size, height: size }
	return src ? (
		<Image
			src={src}
			alt={name || "avatar"}
			className="rounded-full object-cover border border-white/20"
			width={size}
			height={size}
		/>
	) : (
		<div className="rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-medium border border-white/20">
			{initials}
		</div>
	)
}
