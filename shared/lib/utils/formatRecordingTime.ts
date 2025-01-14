export const formatRecordingTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	const millis = Math.floor((seconds % 1) * 1000)

	return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
		2,
		"0"
	)},${String(millis).padStart(3, "000")}`
}
