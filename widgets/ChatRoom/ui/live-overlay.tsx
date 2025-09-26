"use client"

import { Button, Typography, useUser } from "@/shared"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { LiveRoomState } from "@/shared/lib/services/live/live.types"
import { cn } from "@/shared/lib/utils/cn"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/Dialog/dialog"
import Image from "next/image"
import type { PointerEvent as ReactPointerEvent } from "react"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BiSolidMicrophoneOff } from "react-icons/bi"
import {
	LuMaximize2,
	LuMic,
	LuMicOff,
	LuMinimize2,
	LuVideo,
	LuVideoOff,
} from "react-icons/lu"
import { MdCallEnd, MdOutlineGroupAdd } from "react-icons/md"

type Props = {
	chatId: string
	// chat?: ChatType
	isPrivilegedMember: boolean
	room: LiveRoomState | null
	visible: boolean
	nameOfChat: string | undefined
	liveApi: UseLiveRoomApi
	participants: LiveParticipantType[]
	confirmLeaveOpen: boolean
	remoteStreams: Map<string, MediaStream>
	isSelfMuted: boolean
	isSelfVideoOff: boolean | undefined
	localStream: MediaStream | null
	isMinimized: boolean
	onClose: () => void
	closeWindowsLive: () => void
	setConfirmLeaveOpen: (value: boolean) => void
	setIsMinimized: (value: boolean) => void
}

export const LiveOverlay: FC<Props> = ({
	chatId,
	isPrivilegedMember,
	room,
	visible,
	nameOfChat,
	liveApi,
	participants,
	remoteStreams,
	isSelfMuted,
	isSelfVideoOff,
	localStream,
	confirmLeaveOpen,
	isMinimized,
	setIsMinimized,
	onClose,
	closeWindowsLive,
	setConfirmLeaveOpen,
}) => {
	const { user } = useUser()

	const [dockPosition, setDockPosition] = useState<"bl" | "br" | "tr" | "tl">(
		"br"
	)
	const [miniAppeared, setMiniAppeared] = useState(false)
	const miniCardRef = useRef<HTMLDivElement | null>(null)
	const miniWrapperRef = useRef<HTMLDivElement | null>(null)
	const [miniPos, setMiniPos] = useState<{ top: number; left: number } | null>(
		null
	)
	const [isDragging, setIsDragging] = useState(false)
	const dragStart = useRef<{ x: number; y: number } | null>(null)
	const miniStart = useRef<{ top: number; left: number } | null>(null)

	const isVideoOff = isSelfVideoOff

	const title = useMemo(() => {
		if (!room?.isLive) return "Start live stream"
		return nameOfChat
	}, [room, nameOfChat])

	const isLive = room?.isLive

	// Track previous live state to react only on transitions (true -> false)
	const prevIsLiveRef = useRef<boolean | undefined>(isLive)

	const handleLeaveClick = () => {
		if (isPrivilegedMember) {
			setConfirmLeaveOpen(true)
			return
		}
		onClose()
	}

	useEffect(() => {
		const wasLive = prevIsLiveRef.current
		// Close only when live session ends (true -> false),
		// not on initial mount or when starting live (false -> true)
		if (wasLive && !isLive) {
			closeWindowsLive()
			setIsMinimized(false)
		}
		prevIsLiveRef.current = isLive
	}, [closeWindowsLive, isLive, setIsMinimized])

	// Animate mini-player appearance
	useEffect(() => {
		if (isMinimized) {
			setMiniAppeared(false)
			const id = requestAnimationFrame(() => setMiniAppeared(true))
			return () => cancelAnimationFrame(id)
		}
		setMiniAppeared(false)
	}, [isMinimized])

	const description = `${participants.length} participant`

	// Margins inside ChatRoom container
	const MARGIN_TOP = 103
	const MARGIN_RIGHT = 20
	const MARGIN_BOTTOM = 52
	const MARGIN_LEFT = 4

	const getContainerRect = () => {
		const parent = miniWrapperRef.current?.offsetParent as HTMLElement | null
		return parent?.getBoundingClientRect() || null
	}

	const computeMiniPos = useCallback((dock: "bl" | "br" | "tr" | "tl") => {
		const containerRect = getContainerRect()
		if (!containerRect) return { top: MARGIN_TOP, left: MARGIN_LEFT }
		const el = miniCardRef.current
		const w = el?.offsetWidth || 260
		const h = el?.offsetHeight || 56
		const top =
			dock === "tr" || dock === "tl"
				? MARGIN_TOP
				: containerRect.height - MARGIN_BOTTOM - h
		const left =
			dock === "tr" || dock === "br"
				? containerRect.width - MARGIN_RIGHT - w
				: MARGIN_LEFT
		return { top, left }
	}, [])

	// Initialize mini position on minimize and when dockPosition changes
	useEffect(() => {
		if (!isMinimized) return
		const setPos = () => setMiniPos(computeMiniPos(dockPosition))
		const raf = requestAnimationFrame(setPos)
		return () => cancelAnimationFrame(raf)
	}, [isMinimized, dockPosition, computeMiniPos])

	// Adjust on container resize (fallback to window resize)
	useEffect(() => {
		if (!isMinimized) return
		const onResize = () => setMiniPos(computeMiniPos(dockPosition))
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [isMinimized, dockPosition, computeMiniPos])

	const clamp = (val: number, min: number, max: number) =>
		Math.max(min, Math.min(max, val))

	const handleMiniPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement
		if (target?.closest("button")) return

		const containerRect = getContainerRect()
		if (!containerRect) return

		// Ensure we have a concrete position to start dragging from
		const pos = miniPos ?? computeMiniPos(dockPosition)
		setMiniPos(pos)
		miniStart.current = pos
		dragStart.current = { x: e.clientX, y: e.clientY }
		setIsDragging(true)

		const handleMove = (ev: PointerEvent) => {
			if (!dragStart.current || !miniStart.current) return
			const el = miniCardRef.current
			const w = el?.offsetWidth || 260
			const h = el?.offsetHeight || 56
			const dx = ev.clientX - dragStart.current.x
			const dy = ev.clientY - dragStart.current.y
			const nextTop = clamp(
				miniStart.current.top + dy,
				MARGIN_TOP,
				containerRect.height - MARGIN_BOTTOM - h
			)
			const nextLeft = clamp(
				miniStart.current.left + dx,
				MARGIN_LEFT,
				containerRect.width - MARGIN_RIGHT - w
			)
			setMiniPos({ top: nextTop, left: nextLeft })
		}

		const handleUp = (ev: PointerEvent) => {
			setIsDragging(false)
			window.removeEventListener("pointermove", handleMove)
			window.removeEventListener("pointerup", handleUp)
			// Snap to nearest corner using container center
			const x = ev.clientX
			const y = ev.clientY
			const centerX = containerRect.left + containerRect.width / 2
			const centerY = containerRect.top + containerRect.height / 2
			const isRight = x > centerX
			const isBottom = y > centerY
			const next = isBottom ? (isRight ? "br" : "bl") : isRight ? "tr" : "tl"
			setDockPosition(next)
			setMiniPos(computeMiniPos(next))
			dragStart.current = null
			miniStart.current = null
		}

		window.addEventListener("pointermove", handleMove)
		window.addEventListener("pointerup", handleUp, { once: true })
	}

	const handleMinimize = () => {
		setIsMinimized(true)
	}
	const handleMaximize = () => {
		setIsMinimized(false)
	}

	if (!visible && !isMinimized) return null
	return (
		<>
			{/* Mini-player when minimized */}
			{isMinimized && isLive ? (
				<div
					ref={miniWrapperRef}
					className={cn(
						"absolute z-50 transition-all duration-200 ease-out",
						!miniPos && dockPosition === "br" && "bottom-[52px] right-5",
						!miniPos && dockPosition === "bl" && "bottom-[52px] left-1",
						!miniPos && dockPosition === "tr" && "top-[103px] right-5",
						!miniPos && dockPosition === "tl" && "top-[103px] left-1"
					)}
					style={
						miniPos
							? {
									top: miniPos.top,
									left: miniPos.left,
									transition: isDragging ? "none" : undefined,
							  }
							: undefined
					}
					onPointerDown={handleMiniPointerDown}
				>
					<div
						ref={miniCardRef}
						className={cn(
							"flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1A2026] border border-white/10 shadow-lg cursor-grab select-none transition-all duration-150",
							miniAppeared
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-1",
							isDragging
								? "scale-[0.97] shadow-2xl active:cursor-grabbing"
								: "hover:shadow-xl"
						)}
					>
						<div className="flex flex-col">
							<Typography
								tag="p"
								className="text-white text-[13px] font-medium truncate max-w-[180px]"
							>
								{title}
							</Typography>
							<Typography tag="span" className="text-white/60 text-[12px]">
								{description}
							</Typography>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="clean"
								aria-label="Restore"
								className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
								onClick={handleMaximize}
							>
								<LuMaximize2 size={18} />
							</Button>
							<Button
								variant="clean"
								aria-label={isSelfMuted ? "Unmute" : "Mute"}
								className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
								onClick={liveApi.toggleSelfMute}
							>
								{isSelfMuted ? <LuMicOff size={18} /> : <LuMic size={18} />}
							</Button>
							<Button
								variant="clean"
								aria-label="Leave"
								className="bg-[#883E41] hover:bg-[#8b383b] p-2 rounded-full"
								onClick={handleLeaveClick}
							>
								<MdCallEnd size={18} className="text-white" />
							</Button>
						</div>
					</div>
					{/* Keep remote audio playing while minimized */}
					<div className="hidden">
						{Array.from(remoteStreams.values()).map((stream, idx) => (
							<audio
								key={idx}
								ref={node => {
									if (node && stream) {
										;(node as HTMLAudioElement).srcObject = stream
										node.autoplay = true
										node.muted = false
									}
								}}
							/>
						))}
					</div>
				</div>
			) : null}

			{/* Full overlay when not minimized */}
			{visible && !isMinimized ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
					onMouseDown={e => {
						if (e.target === e.currentTarget) handleMinimize()
					}}
				>
					<div
						className={cn(
							"relative flex flex-col mx-10 justify-between border border-white/10 w-full max-w-[420px] h-full max-h-[580px] rounded-lg overflow-hidden bg-[#1A2026]"
							// !isVideoOff && "max-h-[calc(100vh-40px)] h-auto"
						)}
					>
						<div className="w-full px-6 pt-2 pb-0.5 flex flex-col items-center justify-center ">
							<Typography
								tag="p"
								className="text-white text-[14px] font-medium text-center"
							>
								{title}
							</Typography>
							<Typography
								tag="span"
								className="text-white/60 text-[13px] font-normal text-center"
							>
								{description}
							</Typography>
						</div>

						{/* Local video preview */}
						{isLive &&
						localStream &&
						!isSelfVideoOff &&
						localStream.getVideoTracks().length > 0 ? (
							<div className="w-full mb-2 px-3.5 py-0.5">
								<div className="w-full aspect-video rounded-md overflow-hidden border border-white/10 bg-black">
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
								<Typography
									tag="span"
									className="text-white/60 text-[12px] mt-1 block text-center"
								>
									You
								</Typography>
							</div>
						) : null}

						<div
							className={cn(
								"overflow-y-auto px-3.5 py-0.5",
								isVideoOff && "flex-1"
							)}
						>
							{isLive ? (
								<div className="flex flex-col gap-1">
									{participants.map(p => {
										const stream = remoteStreams.get(p.userId)
										return (
											<div
												key={p.userId}
												className="rounded-md overflow-hidden border border-white/10 p-2.5 flex items-center gap-3 bg-[#2C333D]"
											>
												{p.imageUrl ? (
													<Image
														src={p.imageUrl}
														alt={p.name || p.userId}
														width={40}
														height={40}
														className="rounded-full object-cover"
													/>
												) : (
													<div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-medium border border-white/20">
														{(p.name || p.userId).slice(0, 2).toUpperCase()}
													</div>
												)}
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<Typography
															tag="p"
															className="text-white text-[14px] font-medium truncate"
														>
															{p.name || p.userId}
														</Typography>
														<span className="text-white/60 text-[12px] capitalize">
															{p.role}
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2">
													{(
														p.userId === (user?.id || "")
															? !isSelfMuted
															: p.micOn
													) ? (
														<LuMic size={18} className="text-white" />
													) : (
														<LuMicOff size={18} className="text-white/60" />
													)}
												</div>
												{stream ? (
													<audio
														ref={node => {
															if (node && stream) {
																;(node as HTMLAudioElement).srcObject = stream
																node.autoplay = true
																node.muted = false
															}
														}}
														className="hidden"
													/>
												) : null}
											</div>
										)
									})}
								</div>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Typography tag="span" className="text-white/70 text-[15px]">
										No live session. Start one to begin.
									</Typography>
								</div>
							)}
						</div>

						<div className="w-full max-w-[380px] pb-1 pt-2 px-6 flex self-center items-center justify-around gap-4">
							{!isLive ? (
								<>
									<Button
										variant="clean"
										onClick={() => liveApi.startLive(chatId)}
										className="flex items-center gap-2 bg-[#66C95B] hover:bg-[#56b14a] text-white px-4 py-2 rounded-full"
									>
										<MdOutlineGroupAdd size={18} />
										Start live
									</Button>
									<Button
										variant="clean"
										onClick={() => liveApi.joinLive(chatId)}
										className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
									>
										Join as listener
									</Button>
									<Button
										variant="clean"
										onClick={onClose}
										className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
									>
										Close
									</Button>
								</>
							) : (
								<>
									<Button
										variant="clean"
										aria-label={
											isSelfVideoOff ? "Turn camera on" : "Turn camera off"
										}
										className="flex flex-col gap-1.5 font-normal"
										onClick={liveApi.toggleSelfVideo}
									>
										<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
											{isSelfVideoOff ? (
												<LuVideo size={22} />
											) : (
												<LuVideoOff size={22} />
											)}
										</div>
										<span className="text-white text-[11px]">Video</span>
									</Button>

									<Button
										variant="clean"
										aria-label={isSelfMuted ? "Unmute" : "Mute"}
										className="flex flex-col gap-1.5 font-normal"
										onClick={liveApi.toggleSelfMute}
									>
										<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-[26px] rounded-full">
											{isSelfMuted ? (
												<BiSolidMicrophoneOff size={35} />
											) : (
												<LuMic size={35} />
											)}
										</div>
										<span className="text-white text-[15px]">
											{isSelfMuted ? "Unmute" : "Mute"}
										</span>
									</Button>

									<Button
										variant="clean"
										aria-label="Leave"
										className="flex flex-col gap-1.5"
										onClick={handleLeaveClick}
									>
										<div className="flex items-center justify-center bg-[#883E41] hover:bg-[#8b383b] p-3 rounded-full">
											<MdCallEnd size={22} className="text-white" />
										</div>
										<span className="text-white text-[11px] !font-normal">
											Leave
										</span>
									</Button>
								</>
							)}
						</div>
						<Button
							variant="clean"
							aria-label="Minimize"
							className="flex flex-col gap-1.5 absolute top-2.5 right-2.5"
							onClick={handleMinimize}
						>
							<div className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-1 rounded-full">
								<LuMinimize2 size={18} />
							</div>
						</Button>
					</div>
				</div>
			) : null}

			{/* Leave/Stop live confirmation for privileged members */}
			{isPrivilegedMember && (
				<Dialog open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
					<DialogContent className="bg-[#1A2026] border-white/10 text-white w-[300px]">
						<DialogHeader>
							<DialogTitle>Leave or stop live?</DialogTitle>
						</DialogHeader>
						<DialogFooter className="">
							<div className="w-full flex items-center justify-end gap-2">
								<Button
									variant="clean"
									aria-label="Leave"
									className=" text-white px-4 py-2 rounded-md"
									onClick={() => {
										setConfirmLeaveOpen(false)
										liveApi.leaveLive(chatId)
										onClose()
									}}
								>
									Leave
								</Button>
								<Button
									aria-label="Stop live"
									variant="clean"
									className=" text-white px-4 py-2 rounded-md hover:text-blue-600"
									onClick={() => {
										setConfirmLeaveOpen(false)
										liveApi.stopLive(chatId)
									}}
								>
									Stop live
								</Button>
							</div>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	)
}
