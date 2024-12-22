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
		const socketInstance = io(process.env.NEXT_PUBLIC_WS_BACKEND_URL, {
			withCredentials: true,
			transports: ["websocket"],
			extraHeaders: {
				Authorization: `Bearer ${token}`,
			}, // Обеспечивает использование только WebSocket
		})

		setSocket(socketInstance)

		socketInstance.on("connect", () => {
			setIsConnected(true)
		})

		socketInstance.on("disconnect", () => {
			setIsConnected(false)
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
