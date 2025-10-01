"use client"

import {
	GetLiveRoomStateDto,
	LiveRoomState,
} from "@/shared/lib/services/live/live.types"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useEffect, useMemo, useState } from "react"

/**
 * Lightweight hook to know if a live stream is currently running in a chat.
 * Does not join the room or request media permissions.
 */
export const useLiveStatus = (chatId?: string) => {
	const { socket } = useSocket()
	const [room, setRoom] = useState<LiveRoomState | null>(null)

	useEffect(() => {
		if (!socket || !chatId) return

		const fetchSnapshot = () => {
			socket.emit(
				"getLiveRoomState",
				{ chatId } as GetLiveRoomStateDto,
				(resp?: LiveRoomState) => {
					if (resp && resp.chatId === chatId) setRoom(resp)
				}
			)
		}

		const handleLiveState = (payload: LiveRoomState) => {
			if (payload.chatId === chatId) setRoom(payload)
		}

		// Fetch once, then rely on server-pushed updates
		fetchSnapshot()
		socket.emit("joinChat", { chatId })
		socket.on("liveState", handleLiveState)
		socket.on("liveRoomState", handleLiveState)
		return () => {
			socket.off("liveState", handleLiveState)
			socket.off("liveRoomState", handleLiveState)
		}
	}, [socket, chatId])

	const isLive = useMemo(() => !!room?.isLive, [room])
	return { isLive, room }
}
