import { format, isThisWeek, isToday } from "date-fns"

export function formatDateTelegramStyle(date: Date | null) {
	// const now = new Date()
	if (!date) return ""

	// Проверяем, если дата - сегодня
	if (isToday(date)) {
		return format(date, "HH:mm") // Часы и минуты
	}

	// Проверяем, если дата находится в этой неделе, но не сегодня
	if (isThisWeek(date, { weekStartsOn: 1 })) {
		// Начало недели с понедельника
		return format(date, "EEE") // День недели: Mon, Tue, ...
	}

	// Если дата не в этой неделе (старше)
	return format(date, "dd.MM.yyyy") // Формат DD.MM.YYYY
}
