export const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	const paddedMins = String(mins).padStart(2, "0")
	const paddedSecs = String(secs).padStart(2, "0")
	return `${paddedMins}:${paddedSecs}`
}
