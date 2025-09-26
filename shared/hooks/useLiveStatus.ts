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

		fetchSnapshot()
		socket.on("liveRoomState", handleLiveState)

		const id = setInterval(fetchSnapshot, 5000)
		return () => {
			socket.off("liveRoomState", handleLiveState)
			clearInterval(id)
		}
	}, [socket, chatId])

	const isLive = useMemo(() => !!room?.isLive, [room])
	return { isLive, room }
}
