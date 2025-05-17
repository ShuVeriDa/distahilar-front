export const generateTemporaryId = () =>
	`temp-${Math.random().toString(36).slice(2, 11)}`
