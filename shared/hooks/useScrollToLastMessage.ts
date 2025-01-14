"use client"

import { MessageType } from "@/prisma/models"
import { useLayoutEffect, useRef } from "react"

export const useScrollToLastMessage = (messages: MessageType[]) => {
	const containerRef = useRef<HTMLDivElement | null>(null)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (container) {
			const scrollToBottom = () => {
				container.scrollTop = container.scrollHeight
			}

			const observer = new MutationObserver(() => {
				scrollToBottom()
			})

			observer.observe(container, {
				childList: true,
				subtree: true,
			})

			// Прокручиваем к последнему сообщению при первой загрузке
			scrollToBottom()

			return () => {
				observer.disconnect()
			}
		}
	}, [messages])

	return { containerRef }
}
