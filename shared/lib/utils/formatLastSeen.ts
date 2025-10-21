import { useTranslations } from "next-intl"

export const useFormatLastSeen = (
	lastSeenDate: Date | null | undefined
): string => {
	const t = useTranslations("LAST_SEEN")

	if (!lastSeenDate) return ""

	const now = new Date()
	const lastSeen = new Date(lastSeenDate!)
	const diff = Math.floor((now.getTime() - lastSeen.getTime()) / 1000)

	if (diff < 60) return t("JUST_NOW")
	if (diff < 3600) return t("MINUTES_AGO", { count: Math.floor(diff / 60) })

	const sameDay = now.toDateString() === lastSeen.toDateString()
	if (sameDay) {
		return t("TODAY_AT", {
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
			t("DAYS_OF_WEEK.0"),
			t("DAYS_OF_WEEK.1"),
			t("DAYS_OF_WEEK.2"),
			t("DAYS_OF_WEEK.3"),
			t("DAYS_OF_WEEK.4"),
			t("DAYS_OF_WEEK.5"),
			t("DAYS_OF_WEEK.6"),
		]
		const dayName = daysOfWeek[lastSeen.getDay()]
		return t("WEEKDAY_AT", {
			day: dayName,
			time: lastSeen.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		})
	}

	return t("DATE", { date: lastSeen.toLocaleDateString() })
}
