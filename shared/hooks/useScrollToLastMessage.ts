"use client"

import { MessageType } from "@/prisma/models"
import { useLayoutEffect, useRef } from "react"

export const useScrollToLastMessage = (messages: MessageType[]) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const isFirstVisit = useRef(true)
	const previousMessagesLength = useRef(0)

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
				previousMessagesLength.current = messages.length
				return
			}

			// Проверяем, добавлено ли новое сообщение
			const hasNewMessage = messages.length > previousMessagesLength.current

			// Проверяем, находится ли пользователь внизу (в пределах 100px от низа)
			const isNearBottom =
				container.scrollTop >=
				container.scrollHeight - container.clientHeight - 100

			// Скролим только если добавлено новое сообщение И пользователь был внизу
			if (hasNewMessage && isNearBottom) {
				scrollToBottom()
			}

			previousMessagesLength.current = messages.length
		}
	}, [messages])

	return { containerRef }
}
