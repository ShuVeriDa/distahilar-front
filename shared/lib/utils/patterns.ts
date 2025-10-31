type TranslateFunction = (key: string) => string

/**
 * Возвращает паттерн для валидации пароля с локализованным сообщением
 * @param t - функция перевода из useTranslations
 */
export const getPasswordPattern = (t: TranslateFunction) => ({
	value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[,.!@#$%^&*])/,
	message: t("PASSWORD_PATTERN"),
})

/**
 * Возвращает паттерн для валидации email с локализованным сообщением
 * @param t - функция перевода из useTranslations
 */
export const getEmailPattern = (t: TranslateFunction) => ({
	value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	message: t("EMAIL_INVALID"),
})

// Обратная совместимость (deprecated - используйте getPasswordPattern и getEmailPattern)
/**
 * @deprecated Используйте getPasswordPattern(t) вместо этого
 */
export const passwordPattern = {
	value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[,.!@#$%^&*])/,
	message:
		"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
}

/**
 * @deprecated Используйте getEmailPattern(t) вместо этого
 */
export const emailPattern = {
	value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	message: "Invalid email address",
}
