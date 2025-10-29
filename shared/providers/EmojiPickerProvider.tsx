"use client"

import { EmojiClickData } from "emoji-picker-react"
import dynamic from "next/dynamic"
import {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { createPortal } from "react-dom"

const Picker = dynamic(
	() => {
		return import("emoji-picker-react")
	},
	{ ssr: false }
)

interface EmojiPickerState {
	isOpen: boolean
	onEmojiClick: ((emoji: EmojiClickData) => void) | null
	anchorElement: HTMLElement | null
}

interface EmojiPickerContextType {
	openPicker: (
		onEmojiClick: (emoji: EmojiClickData) => void,
		anchorElement: HTMLElement | null
	) => void
	closePicker: () => void
	// Removed pickerState from context to prevent unnecessary re-renders
	// Components don't need to subscribe to state changes
}

const EmojiPickerContext = createContext<EmojiPickerContextType | null>(null)

export const useEmojiPicker = () => {
	const context = useContext(EmojiPickerContext)
	if (!context) {
		throw new Error("useEmojiPicker must be used within EmojiPickerProvider")
	}
	return context
}

interface IEmojiPickerProviderProps {
	children: ReactNode
}

export const EmojiPickerProvider: FC<IEmojiPickerProviderProps> = ({
	children,
}) => {
	const [pickerState, setPickerState] = useState<EmojiPickerState>({
		isOpen: false,
		onEmojiClick: null,
		anchorElement: null,
	})
	const [position, setPosition] = useState<{
		top: number
		left: number
	} | null>(null)
	const [isMounted, setIsMounted] = useState(false)
	const pickerContainerRef = useRef<HTMLDivElement>(null)
	const onEmojiClickRef = useRef<((emoji: EmojiClickData) => void) | null>(null)

	const openPicker = useCallback(
		(
			onEmojiClick: (emoji: EmojiClickData) => void,
			anchorElement: HTMLElement | null
		) => {
			onEmojiClickRef.current = onEmojiClick
			setPickerState({
				isOpen: true,
				onEmojiClick,
				anchorElement,
			})
		},
		[]
	)

	const closePicker = useCallback(() => {
		onEmojiClickRef.current = null
		setPickerState({
			isOpen: false,
			onEmojiClick: null,
			anchorElement: null,
		})
	}, [])

	const handleEmojiClick = useCallback(
		(emoji: EmojiClickData) => {
			if (onEmojiClickRef.current) {
				onEmojiClickRef.current(emoji)
			}
			closePicker()
		},
		[closePicker]
	)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	// Обновляем позицию при изменении anchorElement или при скролле/изменении размера окна
	useEffect(() => {
		if (!pickerState.isOpen || !pickerState.anchorElement) {
			setPosition(null)
			return
		}

		const updatePosition = () => {
			if (!pickerState.anchorElement) return

			// Используем requestAnimationFrame для правильного вычисления позиции после рендера в Portal
			requestAnimationFrame(() => {
				if (!pickerState.anchorElement) return
				const rect = pickerState.anchorElement.getBoundingClientRect()

				setPosition({
					top: rect.top,
					left: rect.left,
				})
			})
		}

		// Задержка для того, чтобы элемент успел отрендериться в Portal Radix UI
		const timeoutId = setTimeout(() => {
			updatePosition()
		}, 100)

		// Обновляем позицию при скролле и изменении размера окна
		window.addEventListener("scroll", updatePosition, true)
		window.addEventListener("resize", updatePosition)

		return () => {
			clearTimeout(timeoutId)
			window.removeEventListener("scroll", updatePosition, true)
			window.removeEventListener("resize", updatePosition)
		}
	}, [pickerState.isOpen, pickerState.anchorElement])

	// Закрываем picker при клике вне его
	useEffect(() => {
		if (!pickerState.isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerContainerRef.current &&
				!pickerContainerRef.current.contains(event.target as Node) &&
				pickerState.anchorElement &&
				!pickerState.anchorElement.contains(event.target as Node)
			) {
				closePicker()
			}
		}

		// Небольшая задержка, чтобы не закрыть сразу при открытии
		const timeoutId = setTimeout(() => {
			document.addEventListener("mousedown", handleClickOutside)
		}, 100)

		return () => {
			clearTimeout(timeoutId)
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [pickerState.isOpen, closePicker, pickerState.anchorElement])

	const contextValue = useMemo(
		() => ({
			openPicker,
			closePicker,
		}),
		[openPicker, closePicker]
	)

	if (!isMounted) {
		return <>{children}</>
	}

	return (
		<EmojiPickerContext.Provider value={contextValue}>
			{children}
			{pickerState.isOpen &&
				position &&
				createPortal(
					<div
						ref={pickerContainerRef}
						className="fixed z-[99999]"
						style={{
							top: `${position.top}px`,
							left: `${position.left}px`,
							pointerEvents: "auto",
						}}
					>
						<Picker
							reactionsDefaultOpen={true}
							className="!bg-white dark:!bg-[#17212B] dark:border-[#17212B]"
							lazyLoadEmojis
							onEmojiClick={handleEmojiClick}
						/>
					</div>,
					document.body
				)}
		</EmojiPickerContext.Provider>
	)
}
