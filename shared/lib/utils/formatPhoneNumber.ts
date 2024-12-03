export const formatPhoneNumber = (input: string) => {
	const numericValue = input.replace(/\D/g, "") // Удаляем все символы, кроме цифр

	if (numericValue.startsWith("7") || numericValue.startsWith("8")) {
		// Заменяем 7 или 8 на +7
		const correctedValue = `7${numericValue.slice(1)}`

		let formatted = "+7 "

		if (correctedValue.length > 1) {
			formatted += `(${correctedValue.slice(1, 4)}` // Код города
		}
		if (correctedValue.length >= 5) {
			formatted += `) ${correctedValue.slice(4, 7)}` // Первая часть номера
		}
		if (correctedValue.length >= 8) {
			formatted += `-${correctedValue.slice(7, 9)}` // Вторая часть номера
		}
		if (correctedValue.length >= 10) {
			formatted += `-${correctedValue.slice(9, 11)}` // Третья часть номера
		}

		return formatted
	} else {
		// Форматируем международные номера
		let formatted = `+${numericValue.slice(0, 1)}` // Код страны

		if (numericValue.length > 1) {
			formatted += ` (${numericValue.slice(1, 4)}` // Первая группа после кода страны
		}
		if (numericValue.length >= 5) {
			formatted += `) ${numericValue.slice(4, 7)}` // Вторая группа
		}
		if (numericValue.length >= 8) {
			formatted += `-${numericValue.slice(7, 9)}` // Третья группа
		}
		if (numericValue.length >= 10) {
			formatted += `-${numericValue.slice(9, 11)}` // Четвертая группа
		}

		return formatted
	}
}
