"use client"

import { MessageType } from "@/prisma/models"
import { useLayoutEffect, useRef } from "react"

export const useScrollToLastMessage = (messages: MessageType[]) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const isFirstVisit = useRef(true)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (container) {
			const scrollToBottom = () => {
				container.scrollTop = container.scrollHeight
			}

			// Прокрутка при первом посещении
			if (isFirstVisit.current) {
				scrollToBottom()
				isFirstVisit.current = false
			}

			// Прокрутка при изменении сообщений
			scrollToBottom()
		}
	}, [messages])

	return { containerRef }
}
