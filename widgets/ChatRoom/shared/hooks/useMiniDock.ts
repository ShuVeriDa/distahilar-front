import { useCallback, useEffect, useRef, useState } from "react"

export type DockCorner = "bl" | "br" | "tr" | "tl"

type Margins = {
	top: number
	right: number
	bottom: number
	left: number
}

type UseMiniDockParams = {
	isMinimized: boolean
	margins: Margins
}

export function useMiniDock({ isMinimized, margins }: UseMiniDockParams) {
	const [dockPosition, setDockPosition] = useState<DockCorner>("br")
	const [miniAppeared, setMiniAppeared] = useState(false)
	const [miniPos, setMiniPos] = useState<{ top: number; left: number } | null>(
		null
	)
	const [isDragging, setIsDragging] = useState(false)

	const miniCardRef = useRef<HTMLDivElement | null>(null)
	const miniWrapperRef = useRef<HTMLDivElement | null>(null)
	const dragStart = useRef<{ x: number; y: number } | null>(null)
	const miniStart = useRef<{ top: number; left: number } | null>(null)
	// const { isLive: isRoomLive } = useLiveStatus(chatId)

	const getContainerRect = () => {
		// Constrain to ChatRoom root if present, otherwise fallback to viewport body
		const chatRoot = document.querySelector(
			"[data-chat-room-root]"
		) as HTMLElement | null
		if (chatRoot) return chatRoot.getBoundingClientRect()
		const parent = miniWrapperRef.current?.offsetParent as HTMLElement | null
		return parent?.getBoundingClientRect() || null
	}

	const computeMiniPos = useCallback(
		(dock: DockCorner) => {
			const containerRect = getContainerRect()
			if (!containerRect) return { top: margins.top, left: margins.left }
			const el = miniCardRef.current
			const w = el?.offsetWidth || 260
			const h = el?.offsetHeight || 56
			// Compute offsets within the ChatRoom rect, then translate to viewport coords
			const innerTop =
				dock === "tr" || dock === "tl"
					? margins.top
					: containerRect.height - margins.bottom - h
			const innerLeft =
				dock === "tr" || dock === "br"
					? containerRect.width - margins.right - w
					: margins.left
			return {
				top: containerRect.top + innerTop,
				left: containerRect.left + innerLeft,
			}
		},
		[margins.bottom, margins.left, margins.right, margins.top]
	)

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

	// Animate mini-player appearance when minimized
	useEffect(() => {
		if (isMinimized) {
			setMiniAppeared(false)
			const id = requestAnimationFrame(() => setMiniAppeared(true))
			return () => cancelAnimationFrame(id)
		}
		setMiniAppeared(false)
	}, [isMinimized])

	const clamp = (val: number, min: number, max: number) =>
		Math.max(min, Math.min(max, val))

	const handleMiniPointerDown = (
		e: PointerEvent | React.PointerEvent<HTMLDivElement>
	) => {
		const target = (e as PointerEvent).target as HTMLElement
		if (target?.closest("button")) return

		const containerRect = getContainerRect()
		if (!containerRect) return

		const pos = miniPos ?? computeMiniPos(dockPosition)
		setMiniPos(pos)
		miniStart.current = pos
		dragStart.current = {
			x: (e as PointerEvent).clientX,
			y: (e as PointerEvent).clientY,
		}
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
				containerRect.top + margins.top,
				containerRect.bottom - margins.bottom - h
			)
			const nextLeft = clamp(
				miniStart.current.left + dx,
				containerRect.left + margins.left,
				containerRect.right - margins.right - w
			)
			setMiniPos({ top: nextTop, left: nextLeft })
		}

		const handleUp = (ev: PointerEvent) => {
			setIsDragging(false)
			window.removeEventListener("pointermove", handleMove)
			window.removeEventListener("pointerup", handleUp)
			const x = ev.clientX
			const y = ev.clientY
			const centerX = containerRect.left + containerRect.width / 2
			const centerY = containerRect.top + containerRect.height / 2
			const isRight = x > centerX
			const isBottom = y > centerY
			const next: DockCorner = isBottom
				? isRight
					? "br"
					: "bl"
				: isRight
				? "tr"
				: "tl"
			setDockPosition(next)
			setMiniPos(computeMiniPos(next))
			dragStart.current = null
			miniStart.current = null
		}

		window.addEventListener("pointermove", handleMove)
		window.addEventListener("pointerup", handleUp, { once: true })
	}

	return {
		miniWrapperRef,
		miniCardRef,
		miniPos,
		isDragging,
		miniAppeared,
		dockPosition,
		setDockPosition,
		handleMiniPointerDown,
	}
}
