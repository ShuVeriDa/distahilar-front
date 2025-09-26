"use client"

import { ChatType } from "@/prisma/models"
import {
	useLiveRoom,
	UseLiveRoomApi,
	UseLiveRoomState,
} from "@/shared/hooks/useLiveRoom"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { LiveOverlay } from "@/widgets/ChatRoom/ui/live-overlay"
import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from "react"

type LiveOverlayMeta = {
	nameOfChat?: string
	isPrivilegedMember?: boolean
	chat?: ChatType
}

type LiveContextValue = {
	// UI state
	visible: boolean
	isMinimized: boolean
	confirmLeaveOpen: boolean
	nameOfChat?: string
	isPrivilegedMember: boolean
	currentChatId: string | null
	// Live state
	state: UseLiveRoomState
	api: UseLiveRoomApi
	participants: LiveParticipantType[]
	// Actions
	openOverlay: (chatId: string, meta?: LiveOverlayMeta) => void
	closeOverlay: () => void
	minimize: () => void
	maximize: () => void
	setConfirmLeaveOpen: (value: boolean) => void
	setMeta: (meta: LiveOverlayMeta) => void
	joinLive: (chatId: string, meta?: LiveOverlayMeta) => void
	startLive: (chatId: string, meta?: LiveOverlayMeta) => void
	leaveLive: () => void
	stopLive: () => void
}

const LiveContext = createContext<LiveContextValue | null>(null)

export const useLiveGlobal = () => {
	const ctx = useContext(LiveContext)
	if (!ctx)
		throw new Error("useLiveGlobal must be used within LiveGlobalProvider")
	return ctx
}

export const LiveGlobalProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [visible, setVisible] = useState(false)
	const [isMinimized, setIsMinimized] = useState(false)
	const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)
	const [nameOfChat, setNameOfChat] = useState<string | undefined>(undefined)
	const [isPrivilegedMember, setIsPrivilegedMember] = useState(false)
	const [currentChatId, setCurrentChatId] = useState<string | null>(null)
	const [chat, setChat] = useState<ChatType | undefined>(undefined)

	const [state, api, participants] = useLiveRoom({ chat })

	const openOverlay = (chatId: string, meta?: LiveOverlayMeta) => {
		if (meta?.chat) setChat(meta.chat)
		if (meta?.nameOfChat !== undefined) setNameOfChat(meta.nameOfChat)
		if (meta?.isPrivilegedMember !== undefined)
			setIsPrivilegedMember(!!meta.isPrivilegedMember)
		setCurrentChatId(chatId)
		setVisible(true)
		setIsMinimized(false)
	}

	const setMeta = (meta: LiveOverlayMeta) => {
		if (meta.chat) setChat(meta.chat)
		if (meta.nameOfChat !== undefined) setNameOfChat(meta.nameOfChat)
		if (meta.isPrivilegedMember !== undefined)
			setIsPrivilegedMember(!!meta.isPrivilegedMember)
	}

	const closeOverlay = () => {
		setVisible(false)
		setIsMinimized(false)
		setConfirmLeaveOpen(false)
	}

	const minimize = () => setIsMinimized(true)
	const maximize = () => setIsMinimized(false)

	const joinLive = (chatId: string, meta?: LiveOverlayMeta) => {
		openOverlay(chatId, meta)
		api.joinLive(chatId)
	}

	const startLive = (chatId: string, meta?: LiveOverlayMeta) => {
		openOverlay(chatId, meta)
		api.startLive(chatId)
	}

	const leaveLive = () => {
		const id = currentChatId || state.chatId
		if (id) api.leaveLive(id)
		closeOverlay()
	}

	const stopLive = () => {
		const id = currentChatId || state.chatId
		if (id) api.stopLive(id)
		// Do not auto-close; overlay itself will close on state end
	}

	const value: LiveContextValue = useMemo(
		() => ({
			visible,
			isMinimized,
			confirmLeaveOpen,
			nameOfChat,
			isPrivilegedMember,
			currentChatId,
			state,
			api,
			participants,
			openOverlay,
			closeOverlay,
			minimize,
			maximize,
			setConfirmLeaveOpen,
			setMeta,
			joinLive,
			startLive,
			leaveLive,
			stopLive,
		}),
		[
			visible,
			isMinimized,
			confirmLeaveOpen,
			nameOfChat,
			isPrivilegedMember,
			currentChatId,
			state,
			api,
			participants,
		]
	)

	return (
		<LiveContext.Provider value={value}>
			{children}
			<LiveOverlay
				room={state.room}
				chatId={(currentChatId || state.chatId || "") as string}
				liveApi={api}
				visible={visible}
				nameOfChat={nameOfChat}
				isSelfMuted={state.isSelfMuted}
				localStream={state.localStream}
				participants={participants}
				remoteStreams={state.remoteStreams}
				isSelfVideoOff={state.isSelfVideoOff}
				confirmLeaveOpen={confirmLeaveOpen}
				isPrivilegedMember={isPrivilegedMember}
				isMinimized={isMinimized}
				setIsMinimized={setIsMinimized}
				closeWindowsLive={() => setVisible(false)}
				onClose={leaveLive}
				setConfirmLeaveOpen={setConfirmLeaveOpen}
			/>
		</LiveContext.Provider>
	)
}

export type { UseLiveRoomApi, UseLiveRoomState }
