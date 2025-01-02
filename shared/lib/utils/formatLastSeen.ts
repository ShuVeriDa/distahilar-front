import { useTranslations } from "next-intl"

export const useFormatLastSeen = (
	lastSeenDate: Date | null | undefined
): string => {
	const t = useTranslations("pages.Chat.lastSeen")

	if (!lastSeenDate) return ""

	const now = new Date()
	const lastSeen = new Date(lastSeenDate!)
	const diff = Math.floor((now.getTime() - lastSeen.getTime()) / 1000)

	if (diff < 60) return t("justNow")
	if (diff < 3600) return t("minutesAgo", { count: Math.floor(diff / 60) })

	const sameDay = now.toDateString() === lastSeen.toDateString()
	if (sameDay) {
		return t("todayAt", {
			time: lastSeen.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		})
	}

	const daysDiff = Math.floor(diff / 86400)
	if (daysDiff < 7) {
		// Локально определяем массив дней недели
		const daysOfWeek = [
			t("daysOfWeek.0"),
			t("daysOfWeek.1"),
			t("daysOfWeek.2"),
			t("daysOfWeek.3"),
			t("daysOfWeek.4"),
			t("daysOfWeek.5"),
			t("daysOfWeek.6"),
		]
		const dayName = daysOfWeek[lastSeen.getDay()]
		return t("weekdayAt", {
			day: dayName,
			time: lastSeen.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		})
	}

	return t("date", { date: lastSeen.toLocaleDateString() })
}
