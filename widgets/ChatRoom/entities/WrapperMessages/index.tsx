"use client"

import { useUser } from "@/shared"
import { useScrollToLastMessage } from "@/shared/hooks/useScrollToLastMessage"

import { ChatType, MessageType } from "@/prisma/models"
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual"
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import { Message } from "@/features/MessageTrigger"
import { cn } from "@/shared/lib/utils/cn"
import { Messages } from "./Messages"

interface IWrapperMessagesProps {
	locale: string
	messages: MessageType[]
	chat: ChatType | undefined
	isLoadingMessages: boolean
	hasSelectedMessages: boolean
	selectedMessages: MessageType[]
	setSelectedMessages: Dispatch<SetStateAction<MessageType[]>>
	handleEditMessage: (message: MessageType | null) => void
	handleReplyMessage: (message: MessageType | null) => void
	onLoadMore?: () => void
	hasNextPage?: boolean
	isFetchingNextPage?: boolean
}

export const WrapperMessages: FC<IWrapperMessagesProps> = ({
	chat,
	locale,
	messages,
	selectedMessages,
	isLoadingMessages,
	hasSelectedMessages,
	handleEditMessage,
	handleReplyMessage,
	setSelectedMessages,
	onLoadMore,
	hasNextPage,
	isFetchingNextPage,
}) => {
	const { containerRef } = useScrollToLastMessage(messages)
	const topSentinelRef = useRef<HTMLDivElement | null>(null)
	const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { user } = useUser()
	const userId = user?.id
	const [highlightedMessageId, setHighlightedMessageId] = useState<
		string | null
	>(null)

	// Virtualizer
	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => 72,
		overscan: 8,
		measureElement: (el: Element) =>
			(el as HTMLElement).getBoundingClientRect().height,
	})

	const virtualItems = rowVirtualizer.getVirtualItems()

	// Function to handle scrolling to a replied message
	const handleScrollToReply = useCallback(
		(repliedToId: string) => {
			const messageIndex = messages.findIndex(msg => msg.id === repliedToId)
			if (messageIndex !== -1) {
				// Clear previous timeout if it exists
				if (highlightTimeoutRef.current) {
					clearTimeout(highlightTimeoutRef.current)
				}
				// Set highlight
				setHighlightedMessageId(repliedToId)
				// Remove highlight after 2 seconds
				highlightTimeoutRef.current = setTimeout(() => {
					setHighlightedMessageId(null)
					highlightTimeoutRef.current = null
				}, 2000)
				// Scroll to message
				rowVirtualizer.scrollToIndex(messageIndex, {
					align: "center",
					behavior: "smooth",
				})
			}
		},
		[messages, rowVirtualizer]
	)

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (highlightTimeoutRef.current) {
				clearTimeout(highlightTimeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (!onLoadMore || !hasNextPage) return
		const sentinel = topSentinelRef.current
		if (!sentinel) return
		const root = containerRef.current
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						onLoadMore()
					}
				})
			},
			{ root, rootMargin: "0px", threshold: 0.1 }
		)
		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [onLoadMore, hasNextPage, containerRef])

	return (
		<div
			ref={containerRef}
			className="w-full h-full overflow-y-auto overflow-x-hidden telegram-scrollbar flex-1 px-3 py-3" // вернуть px-5
		>
			{/* Top sentinel for infinite scroll up (older messages) */}
			<div ref={topSentinelRef} />
			{!isLoadingMessages ? (
				<div
					style={{
						height: rowVirtualizer.getTotalSize(),
						position: "relative",
						width: "100%",
					}}
				>
					{virtualItems.map((virtualRow: VirtualItem) => {
						const index = virtualRow.index
						const message = messages[index]
						return (
							<div
								key={message.id}
								data-index={index}
								ref={rowVirtualizer.measureElement}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<Messages
									message={message}
									userId={userId}
									index={index}
									messages={messages}
									selectedMessages={selectedMessages}
									hasSelectedMessages={hasSelectedMessages}
									locale={locale}
									chat={chat}
									setSelectedMessages={setSelectedMessages}
									handleEditMessage={handleEditMessage}
									handleReplyMessage={handleReplyMessage}
									handleScrollToReply={handleScrollToReply}
									highlightedMessageId={highlightedMessageId}
								/>
							</div>
						)
					})}
				</div>
			) : (
				<div className={cn("w-full flex justify-between items-end")}>
					<div className="w-full flex flex-col gap-3">
						{Array.from({ length: 8 }).map((_, i) => {
							const isEqualZero = i % 2 === 0
							return (
								<Message.Skeleton
									key={i}
									isFirstMessage
									isSameMessage={false}
									isMyMessage={isEqualZero ? true : false}
									isNextMessageMine={isEqualZero ? false : true}
									isDifferentSenderPrevious={isEqualZero ? false : true}
								/>
							)
						})}
					</div>
				</div>
			)}
			{isFetchingNextPage && (
				<div className="py-2 text-center text-sm opacity-70">Loading...</div>
			)}
		</div>
	)
}
