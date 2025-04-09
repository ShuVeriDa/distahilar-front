export const formatTime = (
	date: string | Date,
	type: "hh:mm" | "Month number" | "forMessage",
	locale?: string
) => {
	const dateObj = new Date(date)
	if (type === "hh:mm") {
		const hours = String(dateObj.getHours()).padStart(2, "0")
		const minutes = String(dateObj.getMinutes()).padStart(2, "0")
		return `${hours}:${minutes}`
	}

	if (type === "Month number") {
		// const options = { day: "2-digit", month: "short" }
		return dateObj.toLocaleDateString(locale, {
			month: "long",
			day: "2-digit",
		})
	}

	if (type === "forMessage") {
		const dateObj = new Date(date)

		const month = dateObj.toLocaleString(locale, { month: "long" })
		const day = dateObj.getDate()
		const hours = dateObj.getHours().toString().padStart(2, "0")
		const minutes = dateObj.getMinutes().toString().padStart(2, "0")

		return `${month} ${day} at ${hours}:${minutes}`
	}
}
