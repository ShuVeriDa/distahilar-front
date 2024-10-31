export const passwordPattern = {
	value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[,.!@#$%^&*])/,
	message:
		"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
}

export const emailPattern = {
	value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	message: "Invalid email address",
}
