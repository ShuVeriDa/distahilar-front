"use client"

import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { io, Socket } from "socket.io-client"
import { getAccessToken } from "../lib/services/auth/auth.helper"

type SocketContextType = {
	socket: Socket | null
	isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
})

export const useSocket = () => {
	return useContext(SocketContext)
}

interface ISocketProviderProps {
	children: ReactNode
}

export const SocketProvider: FC<ISocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [isConnected, setIsConnected] = useState(false)

	const token = getAccessToken()

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_WS_BACKEND_URL) {
			console.error("NEXT_PUBLIC_WS_BACKEND_URL is not defined")
			return
		}

		const socketInstance = io(process.env.NEXT_PUBLIC_WS_BACKEND_URL, {
			withCredentials: true,
			transports: ["websocket", "polling"], // Добавляем polling как fallback
			upgrade: true, // Позволяет автоматически обновляться с polling на websocket
			auth: {
				token: token,
			},
			extraHeaders: {
				Authorization: `Bearer ${token}`,
			},
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 5,
		})

		setSocket(socketInstance)

		socketInstance.on("connect", () => {
			console.log("Socket connected:", socketInstance.id)
			setIsConnected(true)
		})

		socketInstance.on("disconnect", reason => {
			console.log("Socket disconnected:", reason)
			setIsConnected(false)
		})

		socketInstance.on("connect_error", error => {
			console.error("Socket connection error:", error)
		})

		setIsConnected(!!socketInstance)

		return () => {
			socketInstance.disconnect()
		}
	}, [token])

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	)
}
